const helpers = {};

helpers.is = (object, value) => object === value;

helpers.isNot = (object, value) => object !== value;

helpers.json = (context) => {
    return JSON.stringify(context)
}

module.exports = helpers;
