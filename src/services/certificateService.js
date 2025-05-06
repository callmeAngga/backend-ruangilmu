const Certificate = require('../models/certificateModel');

const createCertificate = async (userId, courseId, finalScore) => {
    return await Certificate.createCertificate(userId, courseId, finalScore);
};

const getCertificate = async (userId, courseId) => {
    return await Certificate.getCertificate(userId, courseId);
};

const getUserCertificates = async (userId) => {
    return await Certificate.getAllUserCertificates(userId);
};

const verifyCertificate = async (certificateNumber) => {
    return await Certificate.verifyCertificate(certificateNumber);
};

module.exports = {
    createCertificate,
    getCertificate,
    getUserCertificates,
    verifyCertificate
};