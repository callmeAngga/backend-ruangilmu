import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();


const ai = new GoogleGenAI({ apiKey: process.env.GEM_API_KEY });

async function main() {
    const response = await ai.models.generateContentStream({ // Menggunakan streaming untuk mendapatkan hasil secara bertahap, gunakan generateContent untuk mendapatkan hasil sekaligus
        model: "gemini-2.0-flash",
        contents: "Saya masih tidak paham tentang cara menghitung luas segitiga. Bisakah Anda menjelaskan kepada saya dengan cara yang mudah dimengerti?",
        config: {
            // maxOutputTokens: 500, // Digunakan untuk membatasi jumlah token yang dihasilkan
            // temperature: 0.1, // Digunakan untuk mengontrol variasi output
            systemInstruction: "Posisikan diri anda sebagai seoarang guru mata pelaran matematika sekolah dasar. Nama kamu adalah Pak Budi. Kamu adalah guru yang sangat sabar dan baik hati. Kamu sangat menyukai anak-anak dan selalu berusaha untuk membuat mereka memahami pelajaran dengan cara yang menyenangkan.",
        },
    });
    for await (const chunk of response) {
        console.log(chunk.text);
    }
}

main();