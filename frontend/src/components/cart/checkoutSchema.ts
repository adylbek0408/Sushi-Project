import { z } from "zod";

export const checkoutSchema = z.object({
  address: z
    .string()
    .max(255)
    .refine((value) => value.trim().length > 0, {
      message: "Укажите адрес доставки",
    }),
  customerName: z
    .string()
    .max(120)
    .refine((value) => value.trim().length > 0, {
      message: "Укажите имя",
    }),
  phone: z
    .string()
    .max(32)
    .refine((value) => value.trim().length > 0, {
      message: "Укажите телефон",
    }),
  comment: z.string().max(1000).optional().or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
