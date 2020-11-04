const helpers = {};

helpers.is = (path, text) => path == text;

helpers.json = (context) => {
    return JSON.stringify(context)
}

module.exports = helpers;
