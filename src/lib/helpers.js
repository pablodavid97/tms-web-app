const helpers = {};

helpers.is = (object, value) => object === value;

helpers.isNot = (object, value) => object !== value;

helpers.and = (object1, value1, object2, value2) =>
  object1 === value1 && object2 === value2;

helpers.or = (object1, value1, object2, value2) =>
  object1 === value1 || object2 === value2;

helpers.json = (context) => {
  return JSON.stringify(context);
};

helpers.getActiveNotifications = (notifications) => {
  var length = notifications.length;
  var counter = 0;

  for (var i = 0; i < length; i++) {
    if (notifications[i].estadoNotificacionId === 1) {
      counter++;
    }
  }

  return counter;
};

module.exports = helpers;
