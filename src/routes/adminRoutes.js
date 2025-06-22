import express from 'express';
import ROLES from '../constants/roles.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Endpoint untuk mendapatkan semua data dashboard
router.get('/dashboard/all', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getAllDashboardData);

// Endpoint untuk mendapatkan empat informasi KPI utama di dashboard admin
// endpoint ini akan mengembalikan data KPI yang mencakup jumlah pengguna, jumlah course, rasio penyelesaian course dan total reviews
router.get('/dashboard/kpis', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getDashboardKPIs);

// Endpoint untuk mendapatkan grafik pertumbuhan pengguna per bulan
router.get('/dashboard/user-growth', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getUserGrowthChart);

// Endpoint untuk mendapatkan jumlah sertifikat yang diterbitkan per course
router.get('/dashboard/certificates-per-course', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getCertificatesPerCourse);

// Endpoint untuk mendapatkan rating dan sentimen review dari course
router.get('/dashboard/course-reviews-sentiment', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getCourseReviewsSentiment);

// Endpoint untuk mendapatkan jumlah pengguna per kelas
router.get('/dashboard/users-per-class', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getUsersPerClass);

// Endpoint untuk mendapatkan tabel course yang mencakup informasi seperti nama, jumlah peserta, presentase review positif dan negatif, persentase kepuasan
router.get('/dashboard/courses-table', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getCourseTable);

// Endpoint untuk mendapatkan daftar pengguna denganperforma terbaik
router.get('/dashboard/top-users', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getTopPerformUsers);

// endpoint untuk manajamen course
router.get('/courses', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getAllCourses);
router.get('/courses/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getCourseById);
router.post('/courses', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.createCourse);
router.put('/courses/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.updateCourse);
router.delete('/courses/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.deleteCourse);

// endpoint untuk manajamen module
router.get('/courses/:courseId/modules', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getModulesByCourse);
router.get('/modules/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getModuleById);
router.post('/courses/:courseId/modules', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.createModule);
router.put('/modules/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.updateModule);
router.delete('/modules/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.deleteModule);

// endpoint untuk manajamen content
router.get('/modules/:moduleId/contents', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getContentsByModule);
router.get('/contents/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.getContentById);
router.post('/modules/:moduleId/contents', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.createContent);
router.put('/contents/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.updateContent);
router.delete('/contents/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), adminController.deleteContent);

export default router;