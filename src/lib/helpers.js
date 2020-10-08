const bcrypt = require('bcryptjs');
const helpers = {};
const saltRounds = 10;

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds); 
    const hash = await bcrypt.hash(password, salt);
    return hash; 
};

helpers.matchPassword = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        console.error(error);
    }
}

module.exports = helpers;