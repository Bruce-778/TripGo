import { z } from "zod";

export const SearchSchema = z.object({
  tripType: z.enum(["PICKUP", "DROPOFF", "POINT_TO_POINT"]),
  fromArea: z.string().min(2),
  toArea: z.string().min(2),
  pickupTime: z.string().min(1),
  passengers: z.coerce.number().int().min(1).max(50),
  luggageSmall: z.coerce.number().int().min(0).max(20).default(0),
  luggageMedium: z.coerce.number().int().min(0).max(20).default(0),
  luggageLarge: z.coerce.number().int().min(0).max(20).default(0)
});

export const CreateBookingSchema = z.object({
  tripType: z.enum(["PICKUP", "DROPOFF", "POINT_TO_POINT"]),
  fromArea: z.string().min(2),
  toArea: z.string().min(2),
  pickupTime: z.string().min(1),
  pickupLocation: z.string().min(2),
  dropoffLocation: z.string().min(2),
  passengers: z.coerce.number().int().min(1).max(50),
  luggageSmall: z.coerce.number().int().min(0).max(20).default(0),
  luggageMedium: z.coerce.number().int().min(0).max(20).default(0),
  luggageLarge: z.coerce.number().int().min(0).max(20).default(0),
  vehicleTypeId: z.string().min(5),
  flightNumber: z.string().optional(),
  flightNote: z.string().optional(),
  contactName: z.string().min(1),
  contactPhone: z.string().min(5),
  contactEmail: z.string().email(),
  contactNote: z.string().optional()
});

export const CancelBookingSchema = z.object({
  bookingId: z.string().min(5),
  contactEmail: z.string().email(),
  reason: z.string().min(2).max(200)
});

export const AdminUpdateBookingSchema = z.object({
  bookingId: z.string().min(5),
  status: z
    .enum(["PENDING_PAYMENT", "PAID", "CONFIRMED", "IN_SERVICE", "COMPLETED", "CANCELLED"])
    .optional(),
  manualAdjustmentJpy: z.coerce.number().int().min(-500000).max(500000).optional(),
  pricingNote: z.string().max(200).optional()
});


