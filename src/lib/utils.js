const bcrypt = require('bcryptjs');
const utils = {};
const saltRounds = 10;

utils.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds); 
    const hash = await bcrypt.hash(password, salt);
    return hash; 
};

utils.matchPassword = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        console.error(error);
    }
}

utils.getHourValues = () => {
    var hours = []

    for(i = 1; i <= 12; i++) {
        hours.push(i)
    }

    return hours
};

utils.getMinuteValues = () => {
    var minutes = []

    for(i = 0; i < 60; i += 5) {
        minutes.push(("0" + i).slice(-2))
    }

    return minutes
}

module.exports = utils;