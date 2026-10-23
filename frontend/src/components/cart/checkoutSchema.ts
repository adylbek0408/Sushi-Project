import { z } from "zod";

/** Delivery-only checkout (pickup tab removed). */
export const checkoutSchema = z.object({
  deliveryType: z.literal("delivery"),
  address: z
    .string()
    .max(255)
    .refine((value) => value.trim().length > 0, {
      message: "Укажите адрес доставки",
    }),
  customerName: z.string().max(120).optional().or(z.literal("")),
  phone: z.string().max(32).optional().or(z.literal("")),
  comment: z.string().max(1000).optional().or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
