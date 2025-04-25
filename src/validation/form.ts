import { z } from "zod"

export const subjectSchema = z.object({
  subjectName: z
    .string()
    .min(3, { message: "Subject name must be at least 3 characters" }).trim()
})

export type SubjectForm = z.infer<typeof subjectSchema>;

export const flashCardSchema = z.object({
  question: z.string().min(1, { message: 'Question is required' }).trim(),
  answer: z.string().min(1, { message: 'Answer is required' }).trim(),
});

export type FlashCardSchema = z.infer<typeof flashCardSchema>;

export const multiFlashCardSchema = z.object({
  subject: z.string().min(3, "Subject is required").trim(),
  description: z.string().trim().optional(),
  cards: z.array(flashCardSchema),
});

export type MultiFlashCardSchema = z.infer<typeof multiFlashCardSchema>;

export const noteForm = z.object({
  title: z
  .union([
    z.string().trim().min(1, { message: 'Title is required' }),
    z.literal("")
  ])
  .optional(),
  note: z.string().min(1, { message: 'Content is required' }).trim(),
});

export type NoteSchema = z.infer<typeof noteForm>;