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
};

utils.getHourValues = () => {
  const hours = [];

  for (i = 1; i <= 12; i++) {
    hours.push(i);
  }

  return hours;
};

utils.getMinuteValues = () => {
  const minutes = [];

  for (i = 0; i < 60; i += 5) {
    minutes.push(`0${i}`.slice(-2));
  }

  return minutes;
};

// function to save date into DB
utils.getDateTimeFormat = (date, hours, minutes, format) => {
  console.log('Date: ', date);
  console.log('Hours: ', hours);
  console.log('Minutes: ', minutes);
  const dateValues = date.split('/');

  let hoursValue = hours;

  // Converts PM values to 24 value
  if (format == 2 && hoursValue != '12') {
    hoursValue = String((parseInt(hoursValue) + 12) % 24);
  } else if (format == 1) {
    // Convertas 12 Am to 00 in 24 hour format
    if (hoursValue == '12' && format == 1) {
      hoursValue = '00';
    } else {
      hoursValue = `0${hoursValue}`.slice(-2);
      console.log('Hours: ', hoursValue);
    }
  }

  const minutesValue = `0${minutes}`.slice(-2);

  // Creates date in standard datetime format YYYY-MM-DD hh:mm'
  const time = `${hoursValue}:${minutesValue}`;
  const dateTime = `${dateValues[2]}-${dateValues[1]}-${dateValues[0]} ${time}`;

  console.log('Fecha final: ', dateTime);

  return dateTime;
};

utils.getDateTimeValues = (dateString) => {
  date = new Date(dateString);
  console.log('Typeof: ', typeof date);

  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var dateString = day + '/' + month + '/' + year;

  console.log('Meeting Date: ', dateString);

  var hours = date.getHours();

  var format = {};

  if (hours == 0) {
    hours = 12;
    format = { text: 'AM', value: 1 };
  } else if (hours < 12) {
    format = { text: 'AM', value: 1 };
  } else {
    if (hours != 12) {
      hours = hours - 12;
    }
    format = { text: 'PM', value: 2 };
  }
  var hoursString = String(hours);

  var minutesString = ('0' + date.getMinutes()).slice(-2);

  console.log('Meeting Hours: ', hoursString);
  console.log('Meeting Minutes: ', minutesString);

  return [dateString, hoursString, minutesString, format];
};

module.exports = utils;
