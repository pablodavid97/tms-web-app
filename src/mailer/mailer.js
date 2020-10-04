const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require("nodemailer-express-handlebars");

const options = {
    viewEngine: {
        partialsDir: global.appRoot + '/views/partials',
        layoutsDir: global.appRoot + '/views/layouts',
        extname: ".hbs"
    },
    extName: ".hbs",
    viewPath: 'src/views'
};

let transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

transport.use("compile", hbs(options));

const sendEmail = async (mailObj) => {
    console.log("root: ", global.appRoot);
    const { from, to, subject, template, context} = mailObj;
    try {        
        let mailInfo = await transport.sendMail({ 
            from: from,
            to: to,
            subject: subject, 
            template: template,
            context: context
        }); 

        console.log(`Message sent: ${mailInfo.messageId}`); 
        return`Message sent: ${mailInfo.messageId}`; 

    } catch (error) {
        console.error(error);
        throw new Error (
            'Something went wrong in the sendmail method. Error ${error.message}'
        );
    }
}; 

module.exports = sendEmail;

