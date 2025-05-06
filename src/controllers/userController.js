const httpStatus = require('../constants/httpStatus');
const userService = require('../services/userService');

exports.getMe = async (req, res) => {
    try {
        const user = await userService.getMe(req.user.id);
        res.status(httpStatus.OK).json({ user });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.NOT_FOUND).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user.uid;
        const profileData = req.body;
        
        const updatedUser = await userService.updateProfile(userId, profileData);
        
        res.status(httpStatus.OK).json({ 
            status: 'success', 
            message: 'Profil berhasil diperbarui',
            data: updatedUser 
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.BAD_REQUEST).json({ 
            status: 'error',
            message: error.message 
        });
    }
};