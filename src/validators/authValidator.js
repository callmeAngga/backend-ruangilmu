import { z } from 'zod';

export const registerSchema = z.object({
    nama: z
        .string()
        .min(1, { message: 'Nama tidak boleh kosong' })
        .max(50, { message: 'Nama maksimal 50 karakter' })
        .regex(/^[a-zA-Z\s]+$/, { message: 'Nama hanya boleh berisi huruf dan spasi' }),

    email: z
        .string()
        .email({ message: 'Format email tidak valid' }),

    password: z
        .string()
        .min(8, { message: 'Password minimal 8 karakter' })
        .max(20, { message: 'Password maksimal 20 karakter' })
        .regex(/[A-Z]/, { message: 'Password harus mengandung minimal 1 huruf besar' })
        .regex(/[a-z]/, { message: 'Password harus mengandung minimal 1 huruf kecil' })
        .regex(/[0-9]/, { message: 'Password harus mengandung minimal 1 angka' }),

    confirmPassword: z
        .string()
        .min(8),

})
.refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password harus sama',
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: 'Format email tidak valid' }),

    password: z
        .string()
        .min(8),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: 'Password minimal 8 karakter' })
        .max(20, { message: 'Password maksimal 20 karakter' })
        .regex(/[A-Z]/, { message: 'Password harus mengandung minimal 1 huruf besar' })
        .regex(/[a-z]/, { message: 'Password harus mengandung minimal 1 huruf kecil' })
        .regex(/[0-9]/, { message: 'Password harus mengandung minimal 1 angka' }),

    confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password harus sama',
    path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(8)
        .max(20),

    newPassword: z
        .string()
        .min(8, { message: 'Password minimal 8 karakter' })
        .max(20, { message: 'Password maksimal 20 karakter' })
        .regex(/[A-Z]/, { message: 'Password harus mengandung minimal 1 huruf besar' })
        .regex(/[a-z]/, { message: 'Password harus mengandung minimal 1 huruf kecil' })
        .regex(/[0-9]/, { message: 'Password harus mengandung minimal 1 angka' }),

    confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password dan konfirmasi password harus sama',
    path: ['confirmPassword'],
});