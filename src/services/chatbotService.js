// const { GoogleGenAI } = require('@google/genai');
const AppError = require('../utils/appError');
const httpStatus = require('../constants/httpStatus');
const ChatbotModel = require('../models/chatbotModel');
const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEM_API_KEY });

const sendMessage = async (userId, courseId, message) => {
    try {
        // Dapatkan konteks course
        const courseContext = await ChatbotModel.getCourseContext(courseId);

        if (!courseContext) {
            throw new AppError('Course tidak ditemukan', httpStatus.NOT_FOUND, 'course_id');
        }

        // Buat content dengan konteks course
        const contentWithContext = `
            KONTEKS COURSE: ${courseContext.course_name} - ${courseContext.course_description}

            PERTANYAAN SISWA: ${message}

            Jawab pertanyaan ini hanya jika berkaitan dengan course "${courseContext.course_name}". 
            Jika tidak berkaitan, tolak dengan ramah dan arahkan kembali ke topik course ini.
        `;


        const response = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: contentWithContext,
            config: {
                maxOutputTokens: 200,
                temperature: 0.1,
                systemInstruction: `
                    Anda adalah Pak Budi, seorang guru matematika sekolah dasar yang sabar, ramah, dan sangat menyukai anak-anak.
                    Jelaskan materi dengan cara yang menyenangkan dan mudah dipahami oleh siswa SD.
                    Gunakan bahasa yang sederhana dan sertakan contoh konkret bila perlu untuk membantu pemahaman siswa.
                    Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan course yang sedang dipelajari siswa.
                `,
            },
        });

        let botReply = '';
        for await (const chunk of response) {
            botReply += chunk.text;
        }

        return {
            message: botReply,
            timestamp: new Date().toISOString(),
            course_name: courseContext.course_name
        };

    } catch (error) {
        console.error('Error in sendMessage:', error);
        throw error;
    }
};

const summarizeModule = async (courseId, moduleId) => {
    try {
        // Dapatkan detail module
        const moduleData = await ChatbotModel.getModuleWithContent(courseId, moduleId);

        if (!moduleData) {
            throw new AppError('Module tidak ditemukan', httpStatus.NOT_FOUND, 'module_id');
        }

        // Gabungkan semua konten module
        const moduleContent = moduleData.contents.map(content =>
            `${content.content_type}: ${content.content_text}`
        ).join('\n\n');

        const contentToSummarize = `
            JUDUL MODULE: ${moduleData.title}
            DESKRIPSI: ${moduleData.description}
            
            KONTEN MODULE:
            ${moduleContent}
            
            Buatlah ringkasan yang menarik dan mudah dipahami dari materi di atas.
        `;

        const response = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: contentToSummarize,
            config: {
                maxOutputTokens: 500,
                temperature: 0.1,
                systemInstruction: `
                    Anda adalah Pak Budi, guru matematika SD yang sabar dan ramah.
                    Tugas Anda adalah **merangkum inti materi** dari modul ini.
                    Jelaskan poin-poin utama dengan bahasa yang sangat sederhana, menarik, dan mudah dipahami siswa SD, seolah-olah Anda sedang bercerita tentang hal penting yang harus mereka tahu dari modul ini.
                    Hindari menjawab pertanyaan atau membahas detail yang terlalu mendalam, fokuslah pada **apa yang paling penting** untuk diingat anak-anak.
                `,
            },
        });

        let summary = '';
        for await (const chunk of response) {
            summary += chunk.text;
        }

        return {
            module_title: moduleData.title,
            module_description: moduleData.description,
            summary: summary,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Error in summarizeModule:', error);
        throw error;
    }
};

module.exports = {
    sendMessage,
    summarizeModule,
};