const schedule = require("node-schedule");
const { Record } = require("./models");

let day = new Date();
day = day.getDay();
const set1 = (s) => {
  console.log(s);
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = s.dayOfweek;
  rule.hour = s.hour;
  rule.minute = s.minute;

  schedule.scheduleJob(rule, function () {
    day++;
    if (day === 7) {
      day = 0;
    }
    exports.day = day;
  });
};
const set2 = (s) => {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = s.dayOfweek;
  rule.hour = s.hour;
  rule.minute = s.minute;

  schedule.scheduleJob(rule, function () {
    const deleteRecord = async () => await Record.destroy({ where: {} });
    deleteRecord();
  });
};

exports.day = day;
exports.set1 = set1;
exports.set2 = set2;
