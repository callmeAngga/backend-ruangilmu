const httpStatus = require('../constants/httpStatus');
const certificateService = require('../services/certificateService');
const moduleService = require('../services/moduleService');
const quizService = require('../services/quizService');
const AppError = require('../utils/appError');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { successResponse, failResponse, errorResponse } = require('../utils/responseUtil');

exports.getCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = parseInt(req.params.courseId);

        const finalExam = await quizService.getQuizByCourseId(courseId);
        if (!finalExam || finalExam.length === 0) {
            throw new AppError('Ujian akhir tidak ditemukan untuk course ini', httpStatus.NOT_FOUND, 'quiz_id');
        }

        const examResult = await quizService.checkQuizCompletion(userId, finalExam.quiz_id);
        if (examResult.length === 0) {
            throw new AppError('Anda harus lulus ujian akhir terlebih dahulu', httpStatus.FORBIDDEN, 'final_exam');
        }

        // Dapatkan sertifikat
        let certificate = await certificateService.getCertificate(userId, courseId);
        if (!certificate) {
            certificate = await certificateService.createCertificate(userId, courseId, examResult.score);
        }

        return successResponse(res, httpStatus.OK, "Sertifikat berhasil diambil", {
            ...certificate,
            issue_date: new Date(certificate.issue_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
        });
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengambil sertifikat",
                [{
                    field: error.field,
                    message: error.message
                }]
            );
        }

        return errorResponse(res);
    }
};

exports.downloadCertificate = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;

        const certificate = await certificateService.getCertificate(userId, courseId);
        if (!certificate) {
            throw new AppError('Sertifikat tidak ditemukan', httpStatus.NOT_FOUND, 'certificate');
        }

        const doc = new PDFDocument({
            size: [864, 486],
            margin: 0
        });

        const templatePath = path.join(__dirname, '../uploads/certificates/certificate-template.png');
        const tempDir = path.join(__dirname, '../uploads/temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const fileName = `certificate-${certificate.certificate_number}.pdf`;
        const filePath = path.join(tempDir, fileName);
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });

        const positions = {
            name: {
                x: 0,
                y: doc.page.height / 2 - 60,
                fontSize: 28,
                align: 'center',
                width: doc.page.width,
                color: '#FFFFFF'
            },
            course: {
                x: 0,
                y: doc.page.height / 2 + 30,
                fontSize: 18,
                align: 'center',
                width: doc.page.width
            },

            description: {
                x: doc.page.width * 0.1,
                y: doc.page.height / 2,
                fontSize: 20,
                align: 'center',
                width: doc.page.width * 0.8
            },

            certNumber: {
                x: 130,
                y: doc.page.height - 52,
                fontSize: 9,
                align: 'left'
            },
            date: {
                x: 150,
                y: doc.page.height - 69,
                fontSize: 9,
                align: 'left'
            }
        };

        // Tambahkan nama
        doc.fillColor(positions.name.color)
            .font('Helvetica-Bold')
            .fontSize(positions.name.fontSize)
            .text(certificate.user_name, positions.name.x, positions.name.y, {
                align: positions.name.align,
                width: positions.name.width
            });

        // Tambahkan judul kursus
        doc.fontSize(positions.course.fontSize)
            .text(certificate.course_title, positions.course.x, positions.course.y, {
                align: positions.course.align,
                width: positions.course.width
            });

        // Tambahkan deskripsi
        doc.fontSize(positions.description.fontSize)
            .font('Helvetica')
            .text(`atas keberhasilannya menyelesaikan kelas ${certificate.course_name} dengan sangat baik.`,
                positions.description.x,
                positions.description.y,
                {
                    align: positions.description.align,
                    width: positions.description.width,
                    ellipsis: true,
                    lineBreak: true
                });

        // Tambahkan nomor sertifikat
        doc.fontSize(positions.certNumber.fontSize)
            .text(`${certificate.certificate_number}`, positions.certNumber.x, positions.certNumber.y);

        const issueDate = new Date(certificate.issue_date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        // Tambahkan tanggal
        doc.text(`${issueDate}`, positions.date.x, positions.date.y);
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