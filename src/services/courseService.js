import Course from '../models/courseModel.js';
import Enrollment from '../models/enrollmentModel.js';

const getAllCourses = async () => {
    return await Course.getAllCourses();
};

const getCourseById = async (course_id) => {
    return await Course.getCourseById(course_id);
};

const getCourseBySlug = async (course_slug) => {
    return await Course.getCourseBySlug(course_slug);
};

const getEnrolledCourses = async (user_id) => {
    return await Course.getEnrolledCoursesByUserId(user_id);
};

const enrollCourse = async (user_id, course_id) => {
    return await Enrollment.enrollCourse(user_id, course_id);
};

const checkEnrollmentStatus = async (user_id, course_id) => {
    return await Course.checkUserEnrollment(user_id, course_id);
};

export default {
    getAllCourses,
    getCourseById,
    getEnrolledCourses,
    enrollCourse,
    checkEnrollmentStatus,
    getCourseBySlug
};