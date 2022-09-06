const schedule = require("node-schedule");
const { Record } = require("../Backend-1/models");
let scheduleObj = null;
const set = (s) => {
  let rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = s.dayOfweek;
  rule.hour = s.hour;
  rule.minute = s.minute;

  let job = schedule.scheduleJob(rule, function () {
    console.log("Scheduler has executed!!!");
    deleteRecord = async () => await Record.destroy();
    deleteRecord();
  });
  scheduleObj = job;
};
const cancel = () => {
  if (scheduleObj != null) {
    scheduleObj.cancel();
  }
};
const setScheduler = (s) => {
  cancel();
  set(s);
};
const scheduleData = {
  dayOfweek: [2, 3],
  hour: 18,
  minute: 26,
};

setScheduler(scheduleData);
