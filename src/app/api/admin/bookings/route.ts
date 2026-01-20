import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { AdminUpdateBookingSchema } from "@/lib/validators";
import { getT } from "@/lib/i18n";

export async function POST(req: Request) {
  const { t } = await getT();
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: t(auth.error) }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = AdminUpdateBookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: t("api.invalidParams"), details: parsed.error.flatten() }, { status: 400 });
    }

    const { bookingId, status, manualAdjustmentJpy, pricingNote } = parsed.data;
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: t("api.orderNotFound") }, { status: 404 });

    const nextManual = manualAdjustmentJpy ?? booking.pricingManualAdjustmentJpy;
    const nextStatus = status ?? booking.status;

    const nextTotal =
      booking.pricingBaseJpy + booking.pricingNightJpy + booking.pricingUrgentJpy + nextManual;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: nextStatus,
        pricingManualAdjustmentJpy: nextManual,
        pricingTotalJpy: nextTotal,
        pricingNote: pricingNote ?? booking.pricingNote
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? t("api.serverError") }, { status: 500 });
  }
}


