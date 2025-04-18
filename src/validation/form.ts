import { z } from "zod"

export const subjectSchema = z.object({
  subjectName: z
    .string()
    .min(3, { message: "Subject name must be at least 3 characters" })
})

export type SubjectForm = z.infer<typeof subjectSchema>;