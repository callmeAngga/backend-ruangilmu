import httpStatus from '../constants/httpStatus.js';
import chatbotService from '../services/chatbotService.js';
import AppError from '../utils/appError.js';
import { successResponse, failResponse, errorResponse } from '../utils/responseUtil.js';

// Fungsi untuk mengirim pesan ke chatbot
const sendMessage = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;
        const { message } = req.body;

        // Validasi input
        if (!message || message.trim() === '') {
            throw new AppError('Pesan tidak boleh kosong', httpStatus.BAD_REQUEST, 'message');
        }

        // Kirim pesan ke chatbotService
        const response = await chatbotService.sendMessage(userId, courseId, message);

        return successResponse(res, httpStatus.OK, 'Berhasil mengirim pesan ke chatbot', response);
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengirim pesan ke chatbot",
                [{
                    field: error.field,
                    message: error.message,
                }]
            );
        }

        return errorResponse(res);
    }
}

// Controller untuk merangkum materi modul
const summarize = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const { moduleId } = req.body;

        // Validasi input
        if (!moduleId) {
            throw new AppError('Module ID tidak boleh kosong', httpStatus.BAD_REQUEST, 'module_id');
        }

        // Ambil ringkasan dari chatbotService
        const summary = await chatbotService.summarizeModule(courseId, moduleId);

        return successResponse(res, httpStatus.OK, 'Berhasil mendapatkan ringkasan modul', summary);
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mendapatkan ringkasan modul",
                [{
                    field: error.field,
                    message: error.message,
                }]
            );
        }

        return errorResponse(res);
    }
}

export default {
    sendMessage,
    summarize
};