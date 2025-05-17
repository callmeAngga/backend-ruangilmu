const zod = require('zod');

const { z } = require('zod')

const reviewContentSchema = zod.object({
    content: z
        .string()
        .min(3, { message: "Review minimal 3 karakter"})
        .max(1000, { message: "Review maksimal 1000 karakter"})
        .regex(
            /^[A-Za-z0-9.,!?()'" -]+$/,
            {message: "Hanya huruf, angka, spasi, dan tanda baca standar (.,!?()'\"-) yang diperbolehkan. Emoji, simbol khusus, dan huruf non-Latin tidak diizinkan."}
        )
});

module.exports = {
    reviewContentSchema
};