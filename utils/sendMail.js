const nodemailer = require('nodemailer');

async function sendMail(options) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: 'ishrak575@gmail.com',
      pass: 'xfbtejmpwkdungqh',
    },
  });
  await transporter.sendMail({
    from: '"Patrick Beatman" <ishrak575@gmail.com>',
    to: options.receiver,
    subject: options.subject,
    html: `<b>${options.message}</b>`,
  });
}
module.exports = sendMail;
