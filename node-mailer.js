require("dotenv").config();
const env = process.env;
const nodemailer = require("nodemailer");
class mailer {
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
  welcomeSend = (email) => {
    this.send({
      from: env.MAIL_ID,
      to: email,
      subject: "런블런블",

      html: `
            <a href ="https://www.naver.com"> + <img src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpNvnS39N1DWWaYPfsAOF_6FPoohK1XLxTrg&usqp=CAU"/>`,
    });
  };
  errorAlertSend = (content) => {
    this.send({
      from: env.MAIL_ID,
      to: "dbsdud0033@gmail.com",
      subject: "서비스에 관하여 에러가 발생했습니다.",
      text: content,
    });
  };
  bugReportSend = (nickname, content) => {
    this.send({
      from: env.MAIL_ID,
      to: "dbsdud0033@gmail.com",
      subject: `${nickname}님께서 버그 리포트를 제출하였습니다.`,
      text: content,
    });
  };

  postReportSend = (nickname, postId, check) => {
    let content = "";
    switch (check) {
      case 0:
        content = "게시글이 음란해용";
        break;
      case 1:
        content = "";
        break;
      case 2:
        content = "";
        break;
      case 3:
        content = "";
        break;
      case 4:
        content = "";
        break;
    }
    this.send({
      from: env.MAIL_ID,
      to: "dbsdud0033@gmail.com",
      subject: `${nickname}님께서 ${postId}번째 게시글을 신고하였습니다.`,
      text: content,
    });
  };
}
module.exports = mailer;
