import { z } from "zod";

export const checkoutSchema = z
  .object({
    deliveryType: z.enum(["delivery", "pickup"]),
    address: z.string().max(255).optional().or(z.literal("")),
    customerName: z.string().max(120).optional().or(z.literal("")),
    phone: z.string().max(32).optional().or(z.literal("")),
    comment: z.string().max(1000).optional().or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (value.deliveryType === "delivery") {
      if (!value.address?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Укажите адрес доставки",
        });
      }
    } else {
      if (!value.customerName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["customerName"],
          message: "Укажите имя",
        });
      }
      if (!value.phone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Укажите телефон",
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
