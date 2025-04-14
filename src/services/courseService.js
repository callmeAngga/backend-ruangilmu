const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

const getAllCourses = async () => {
    return await Course.getAllCourses();
}

const getCourseById = async (course_id) => {
    return await Course.getCourseById(course_id);
}

const getEnrolledCourses = async (user_id) => {
    return await Course.getEnrolledCoursesByUserId(user_id);
}

const enrollCourse = async (user_id, course_id) => {
    return await Enrollment.enrollCourse(user_id, course_id);
}

const checkEnrollmentStatus = async (user_id, course_id) => {
    return await Course.checkUserEnrollment(user_id, course_id);
}

module.exports = {
    getAllCourses,
    getCourseById,
    getEnrolledCourses,
    enrollCourse,
    checkEnrollmentStatus
};
