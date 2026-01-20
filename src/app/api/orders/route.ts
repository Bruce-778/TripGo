import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n";

export async function GET(req: Request) {
  const { t } = await getT();
  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.trim();
  if (!email) return NextResponse.json({ error: t("orders.email") }, { status: 400 });

  const bookings = await prisma.booking.findMany({
    where: { contactEmail: email },
    orderBy: { createdAt: "desc" },
    include: { vehicleType: true }
  });

  const rows = bookings.map((b) => ({
    id: b.id,
    createdAt: b.createdAt.toISOString(),
    pickupTime: b.pickupTime.toISOString(),
    pickupLocation: b.pickupLocation,
    dropoffLocation: b.dropoffLocation,
    status: b.status,
    isUrgent: b.isUrgent,
    totalJpy: b.pricingTotalJpy,
    vehicleName: b.vehicleType.name
  }));

  return NextResponse.json({ rows });
}


