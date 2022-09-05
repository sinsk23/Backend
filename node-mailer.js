require("dotenv").config();
const env = process.env;
const nodemailer = require("nodemailer");
class test {
  email = {
    /*host: "smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "813607b00f045e",
    pass: env.PASS,
  },*/
    service: "gmail",
    auth: {
      user: env.MAIL_ID,
      pass: env.MAIL_PASSWORD,
    },
  };

  send = async (data) => {
    nodemailer
      .createTransport({
        service: "gmail",
        auth: {
          user: env.MAIL_ID,
          pass: env.MAIL_PASSWORD,
        },
      })
      .sendMail(data, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info);
          return info.response;
        }
      });
  };

  /*content = {
    from: env.MAIL_ID,
    to: email,
    subject: "런블런블",
    text: "런블런블에 오신걸 환영합니다~1123",
    html: "<h2>런블런블에 오신걸 환영합니다~112233</h2>",
  };*/
  realSend = (email) => {
    this.send({
      from: env.MAIL_ID,
      to: email,
      subject: "런블런블",
      text: "런블런블에 오신걸 환영합니다~1123",
      html: "<h2>런블런블에 오신걸 환영합니다~112233</h2>",
    });
  };
}
module.exports = test;
