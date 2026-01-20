import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicleType: true }
  });

  const rows = bookings.map((b) => ({
    id: b.id,
    createdAt: b.createdAt.toISOString(),
    pickupTime: b.pickupTime.toISOString(),
    fromTo: `${b.pickupLocation} → ${b.dropoffLocation}`,
    vehicleName: b.vehicleType.name,
    contactName: b.contactName,
    contactEmail: b.contactEmail,
    status: b.status,
    isUrgent: b.isUrgent,
    totalJpy: b.pricingTotalJpy,
    manualAdjustmentJpy: b.pricingManualAdjustmentJpy,
    pricingNote: b.pricingNote ?? null
  }));

  return NextResponse.json({ rows });
}


