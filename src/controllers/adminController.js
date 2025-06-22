import httpStatus from '../constants/httpStatus.js';
import adminService from '../services/adminService.js';
import { successResponse, failResponse, errorResponse } from '../utils/responseUtil.js';
import AppError from '../utils/appError.js';

const getDashboardKPIs = async (req, res) => {
    try {
        const kpis = await adminService.getDashboardKPIs();
        return successResponse(res, httpStatus.OK, 'KPI Dashboard berhasil diambil', kpis);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil KPI dashboard');
    }
}

const getUserGrowthChart = async (req, res) => {
    try {
        const { months = 12 } = req.query;
        const chartData = await adminService.getUserGrowthChart(parseInt(months));
        return successResponse(res, httpStatus.OK, 'Data grafik pertumbuhan pengguna berhasil diambil', chartData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil data grafik pertumbuhan pengguna');
    }
}

const getCertificatesPerCourse = async (req, res) => {
    try {
        const certificatesData = await adminService.getCertificatesPerCourse();
        return successResponse(res, httpStatus.OK, 'Data sertifikat per kursus berhasil diambil', certificatesData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil data sertifikat per kursus');
    }
}

const getCourseReviewsSentiment = async (req, res) => {
    try {
        const reviewsSentimentData = await adminService.getCourseReviewsSentiment();
        return successResponse(res, httpStatus.OK, 'Data sentimen ulasan kursus berhasil diambil', reviewsSentimentData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil data sentimen ulasan kursus');
    }
}

const getUsersPerClass = async (req, res) => {
    try {
        const usersPerClassData = await adminService.getUsersPerClass();
        return successResponse(res, httpStatus.OK, 'Data pengguna per kelas berhasil diambil', usersPerClassData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil data pengguna per kelas');
    }
}

const getCourseTable = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'enrolled_users', sortOrder = 'asc' } = req.query;
        const coursesTableData = await adminService.getCoursesTable({
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder
        });
        return successResponse(res, httpStatus.OK, 'Data tabel kursus berhasil diambil', coursesTableData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil data tabel kursus');
    }
}

const getTopPerformUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const topUsersData = await adminService.getTopPerformUsers({
            page: parseInt(page),
            limit: parseInt(limit)
        });
        return successResponse(res, httpStatus.OK, 'Data pengguna berkinerja terbaik berhasil diambil', topUsersData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil data pengguna berkinerja terbaik');
    }
}

const getAllDashboardData = async (req, res) => {
    try {
        const dashboardData = await adminService.getAllDashboardData();
        return successResponse(res, httpStatus.OK, 'Semua data dashboard berhasil diambil', dashboardData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil semua data dashboard');
    }
}

const getAllCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const courses = await adminService.getAllCourses(parseInt(page), parseInt(limit), search);
        return successResponse(res, httpStatus.OK, 'Daftar kursus berhasil diambil', courses);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil daftar kursus');
    }
}

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await adminService.getCourseById(parseInt(id));

        if (!course) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Kursus tidak ditemukan');
        }

        return successResponse(res, httpStatus.OK, 'Detail kursus berhasil diambil', course);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil detail kursus');
    }
}

const createCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const newCourse = await adminService.createCourse(courseData);
        return successResponse(res, httpStatus.CREATED, 'Kursus berhasil dibuat', newCourse);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat membuat kursus baru');
    }
}

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const courseData = req.body;
        const updatedCourse = await adminService.updateCourse(parseInt(id), courseData);

        if (!updatedCourse) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Kursus tidak ditemukan atau gagal diperbarui');
        }

        return successResponse(res, httpStatus.OK, 'Kursus berhasil diperbarui', updatedCourse);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat memperbarui kursus');
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.deleteCourse(parseInt(id));

        if (!result) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Kursus tidak ditemukan atau gagal dihapus');
        }

        return successResponse(res, httpStatus.OK, 'Kursus berhasil dihapus');
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat menghapus kursus');
    }
}

const getModulesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const modules = await adminService.getModulesByCourse(parseInt(courseId));
        return successResponse(res, httpStatus.OK, 'Daftar modul berhasil diambil', modules);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil modul berdasarkan kursus');
    }
}

const getModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const module = await adminService.getModuleById(parseInt(id));

        if (!module) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Modul tidak ditemukan');
        }

        return successResponse(res, httpStatus.OK, 'Detail modul berhasil diambil', module);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil detail modul');
    }
}

const createModule = async (req, res) => {
    try {
        const { courseId } = req.params;
        const moduleData = { ...req.body, course_id: parseInt(courseId) };
        const newModule = await adminService.createModule(moduleData);
        return successResponse(res, httpStatus.CREATED, 'Modul berhasil dibuat', newModule);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat membuat modul baru');
    }
}

const updateModule = async (req, res) => {
    try {
        const { id } = req.params;
        const moduleData = req.body;
        const updatedModule = await adminService.updateModule(parseInt(id), moduleData);

        if (!updatedModule) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Modul tidak ditemukan atau gagal diperbarui');
        }

        return successResponse(res, httpStatus.OK, 'Modul berhasil diperbarui', updatedModule);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat memperbarui modul');
    }
}

const deleteModule = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.deleteModule(parseInt(id));

        if (!result) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Modul tidak ditemukan atau gagal dihapus');
        }

        return successResponse(res, httpStatus.OK, 'Modul berhasil dihapus');
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat menghapus modul');
    }
}

const getContentsByModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const contents = await adminService.getContentsByModule(parseInt(moduleId));
        return successResponse(res, httpStatus.OK, 'Daftar konten berhasil diambil', contents);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil konten berdasarkan modul');
    }
}

const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await adminService.getContentById(parseInt(id));

        if (!content) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Konten tidak ditemukan');
        }

        return successResponse(res, httpStatus.OK, 'Detail konten berhasil diambil', content);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat mengambil detail konten');
    }
}

const createContent = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const contentData = { ...req.body, module_id: parseInt(moduleId) };
        const newContent = await adminService.createContent(contentData);
        return successResponse(res, httpStatus.CREATED, 'Konten berhasil dibuat', newContent);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat membuat konten baru');
    }
}

const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const contentData = req.body;
        const updatedContent = await adminService.updateContent(parseInt(id), contentData);

        if (!updatedContent) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Konten tidak ditemukan atau gagal diperbarui');
        }

        return successResponse(res, httpStatus.OK, 'Konten berhasil diperbarui', updatedContent);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat memperbarui konten');
    }
}

const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.deleteContent(parseInt(id));

        if (!result) {
            return failResponse(res, httpStatus.NOT_FOUND, 'Konten tidak ditemukan atau gagal dihapus');
        }

        return successResponse(res, httpStatus.OK, 'Konten berhasil dihapus');
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan tak terduga saat menghapus konten');
    }
}

export default {
    getDashboardKPIs,
    getUserGrowthChart,
    getCertificatesPerCourse,
    getCourseReviewsSentiment,
    getUsersPerClass,
    getCourseTable,
    getTopPerformUsers,
    getAllDashboardData,
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getModulesByCourse,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
    getContentsByModule,
    getContentById,
    createContent,
    updateContent,
    deleteContent
}
