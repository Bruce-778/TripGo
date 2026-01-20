import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CancelBookingSchema } from "@/lib/validators";
import { canUserCancel } from "@/lib/bookingRules";
import { getT } from "@/lib/i18n";

export async function POST(req: Request) {
  const { t } = await getT();
  try {
    const json = await req.json();
    const parsed = CancelBookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: t("api.invalidParams"), details: parsed.error.flatten() }, { status: 400 });
    }
    const { bookingId, contactEmail, reason } = parsed.data;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: t("api.orderNotFound") }, { status: 404 });
    if (booking.contactEmail !== contactEmail) {
      return NextResponse.json({ error: t("api.emailMismatch") }, { status: 403 });
    }
    if (booking.status === "CANCELLED") {
      return NextResponse.json({ ok: true });
    }

    const now = new Date();
    const decision = canUserCancel(now, booking.pickupTime, booking.isUrgent);
    if (!decision.ok) {
      return NextResponse.json({ error: t(decision.reason) }, { status: 400 });
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CANCELLED",
        cancelReason: reason,
        cancelledAt: new Date()
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? t("api.serverError") }, { status: 500 });
  }
}


