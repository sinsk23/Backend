const schedule = require("node-schedule");
const { Record } = require("./models");
let count = 0;
let day = 0;

let set1 = (s) => {
  console.log(s);
  let rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = s.dayOfweek;
  rule.hour = s.hour;
  rule.minute = s.minute;

  let job = schedule.scheduleJob(rule, function () {
    console.log("함수실행중1분마다", day);
    //const deleteRecord = async () => await Record.destroy({ where: {} });
    //deleteRecord();
    count++;
    day++;
    if (day === 7) {
      day = 0;
    }
    exports.day = day;
  });
};
let set2 = (s) => {
  let rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = s.dayOfweek;
  rule.hour = s.hour;
  rule.minute = s.minute;

  let job = schedule.scheduleJob(rule, function () {
    console.log("실행됐나?");
    const deleteRecord = async () => await Record.destroy({ where: {} });
    deleteRecord();
  });
};
exports.day = day;
exports.set1 = set1;
exports.set2 = set2;
