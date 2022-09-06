const schedule = require("node-schedule");
const { Post } = require("../Backend-1/models");

const set = (s) => {
  let rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [2, 3];
  rule.hour = 15;
  rule.minute = 50;

  let j = schedule.scheduleJob(rule, function () {
    console.log("Scheduler has executed!!!");
    const deleteRecord = async () =>
      await Post.destroy({ where: { postId: 1 } });
    console.log("테스트", Post);
  });
};

set();
