import { z } from 'zod';

export const createCourseSchema = z.object({
  course_name: z.string().min(1, { message: "Nama kursus tidak boleh kosong." }),
  course_description: z.string().min(1, { message: "Deskripsi kursus tidak boleh kosong." }),
  course_price: z.number().min(0, { message: "Harga kursus tidak boleh negatif." }),
  course_slug: z.string().min(1, { message: "Slug kursus tidak boleh kosong." }),
});

export const updateCourseSchema = z.object({
  course_name: z.string().min(1, { message: "Nama kursus tidak boleh kosong." }).optional(),
  course_description: z.string().min(1, { message: "Deskripsi kursus tidak boleh kosong." }).optional(),
  course_price: z.number().min(0, { message: "Harga kursus tidak boleh negatif." }).optional(),
  course_slug: z.string().min(1, { message: "Slug kursus tidak boleh kosong." }).optional(),
  status: z.enum(['published', 'draft']).optional()
});