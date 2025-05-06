const httpStatus = require('../constants/httpStatus');
const certificateService = require('../services/certificateService');
const moduleService = require('../services/moduleService');
const quizService = require('../services/quizService');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.getCertificate = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;
        
        // Cek apakah semua modul sudah diselesaikan
        const moduleCompletion = await moduleService.getAllModulesCompletion(userId, courseId);
        
        if (moduleCompletion.completedCount < moduleCompletion.totalCount) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: 'Anda harus menyelesaikan semua modul terlebih dahulu',
                data: {
                    completedModules: moduleCompletion.completedCount,
                    totalModules: moduleCompletion.totalCount
                }
            });
        }
        
        // Cek apakah sudah lulus ujian akhir
        const finalExam = await quizService.getFinalExam(courseId);
        
        if (!finalExam) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Ujian akhir tidak ditemukan'
            });
        }
        
        const examResult = await quizService.getQuizResult(userId, finalExam.quiz_id);
        
        if (!examResult || !examResult.passed) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: 'Anda harus lulus ujian akhir terlebih dahulu'
            });
        }
        
        // Dapatkan sertifikat
        let certificate = await certificateService.getCertificate(userId, courseId);
        
        // Jika belum ada sertifikat, buat baru
        if (!certificate) {
            certificate = await certificateService.createCertificate(userId, courseId, examResult.score);
        }
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: certificate
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil sertifikat'
        });
    }
};

exports.downloadCertificate = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;
        
        // Dapatkan sertifikat
        const certificate = await certificateService.getCertificate(userId, courseId);
        
        if (!certificate) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Sertifikat tidak ditemukan'
            });
        }
        
        // Buat file PDF sertifikat
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 0
        });
        
        // Gunakan template yang sudah ada
        const templatePath = path.join(__dirname, '../assets/certificate-template.png');
        
        // Buat folder temp jika belum ada
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        
        const fileName = `certificate-${certificate.certificate_number}.pdf`;
        const filePath = path.join(tempDir, fileName);
        
        // Buat stream untuk file
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        
        // Tambahkan template
        doc.image(templatePath, 0, 0, {width: doc.page.width, height: doc.page.height});
        
        // Tambahkan data ke template
        doc.font('Helvetica-Bold')
           .fontSize(28)
           .text(certificate.user_name, 0, doc.page.height / 2 - 30, {
                align: 'center',
                width: doc.page.width
           });
        
        doc.fontSize(18)
           .text(certificate.course_title, 0, doc.page.height / 2 + 30, {
                align: 'center',
                width: doc.page.width
           });
        
        // Tambahkan nomor sertifikat
        doc.fontSize(12)
           .text(`Certificate No: ${certificate.certificate_number}`, 50, doc.page.height - 50);
        
        // Tambahkan tanggal
        const issueDate = new Date(certificate.issue_date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        doc.text(`Issued on: ${issueDate}`, doc.page.width - 250, doc.page.height - 50);
        
        // Finalisasi dokumen
        doc.end();
        
        // Tunggu sampai file selesai ditulis
        stream.on('finish', () => {
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        status: 'error',
                        message: 'Gagal mengunduh sertifikat'
                    });
                }
                
                // Hapus file temporary setelah diunduh
                fs.unlinkSync(filePath);
            });
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengunduh sertifikat'
        });
    }
};

exports.getUserCertificates = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const certificates = await certificateService.getUserCertificates(userId);
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: certificates
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil data sertifikat'
        });
    }
};

exports.verifyCertificate = async (req, res) => {
    try {
        const certificateNumber = req.params.certificateNumber;
        
        const certificate = await certificateService.verifyCertificate(certificateNumber);
        
        if (!certificate) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Sertifikat tidak ditemukan atau tidak valid'
            });
        }
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: {
                certificateNumber: certificate.certificate_number,
                userName: certificate.user_name,
                courseTitle: certificate.course_title,
                issueDate: certificate.issue_date,
                finalScore: certificate.final_score
            }
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal memverifikasi sertifikat'
        });
    }
};