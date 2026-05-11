import { z } from "zod";

export const pointSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do ponto")
    .max(255, "O nome do ponto deve ter no máximo 255 caracteres"),
  latitude: z.coerce.number().min(-90, "A latitude deve estar entre -90 e 90").max(90, "A latitude deve estar entre -90 e 90"),
  longitude: z.coerce.number().min(-180, "A longitude deve estar entre -180 e 180").max(180, "A longitude deve estar entre -180 e 180"),
});

export type PointValues = z.infer<typeof pointSchema>;
