import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateBookingSchema } from "@/lib/validators";
import { computeNightFee, isUrgentOrder } from "@/lib/bookingRules";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = CreateBookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "参数不合法", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const pickupTime = new Date(data.pickupTime);
    const now = new Date();
    const isUrgent = isUrgentOrder(now, pickupTime);
    const isNight = computeNightFee(pickupTime);

    const vehicle = await prisma.vehicleType.findUnique({ where: { id: data.vehicleTypeId } });
    if (!vehicle) {
      return NextResponse.json({ error: "车型不存在" }, { status: 404 });
    }

    const rule = await prisma.pricingRule.findFirst({
      where: {
        fromArea: data.fromArea,
        toArea: data.toArea,
        tripType: data.tripType,
        vehicleTypeId: data.vehicleTypeId
      }
    });
    if (!rule) {
      return NextResponse.json({ error: "该路线暂无报价" }, { status: 404 });
    }

    // 简单容量校验（可扩展为更复杂的行李体积/尺寸规则）
    if (data.passengers > vehicle.seats) {
      return NextResponse.json({ error: "人数超过该车型座位数，请升级车型" }, { status: 400 });
    }
    if (
      data.luggageSmall > vehicle.luggageSmall ||
      data.luggageMedium > vehicle.luggageMedium ||
      data.luggageLarge > vehicle.luggageLarge
    ) {
      return NextResponse.json({ error: "行李数量超过该车型容量，请升级车型" }, { status: 400 });
    }

    const base = rule.basePriceJpy;
    const night = isNight ? rule.nightFeeJpy : 0;
    const urgent = isUrgent ? rule.urgentFeeJpy : 0;
    const total = base + night + urgent;

    const booking = await prisma.booking.create({
      data: {
        tripType: data.tripType,
        pickupTime,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        flightNumber: data.flightNumber,
        flightNote: data.flightNote,
        passengers: data.passengers,
        luggageSmall: data.luggageSmall,
        luggageMedium: data.luggageMedium,
        luggageLarge: data.luggageLarge,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contactNote: data.contactNote,
        vehicleTypeId: data.vehicleTypeId,
        isUrgent,
        pricingBaseJpy: base,
        pricingNightJpy: night,
        pricingUrgentJpy: urgent,
        pricingTotalJpy: total
      }
    });

    return NextResponse.json({ bookingId: booking.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "服务器错误" }, { status: 500 });
  }
}


