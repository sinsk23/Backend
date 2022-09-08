const schedule = require("node-schedule");
const { Record } = require("./models");
class schedules {
  set = (s) => {
    console.log(s);
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = s.dayOfweek;
    rule.hour = s.hour;
    rule.minute = s.minute;

    let job = schedule.scheduleJob(rule, function () {
      console.log("Scheduler has executed!!!");
      const deleteRecord = async () => await Record.destroy({ where: {} });
      deleteRecord();
      console.log("테스트", deleteRecord);
    });
  };
}
module.exports = schedules;
