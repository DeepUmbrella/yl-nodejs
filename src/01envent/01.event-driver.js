const eventEmiter = require("events");

const myEvent = new eventEmiter();

myEvent.on("one", () => {
  console.log("事件1");
});

myEvent.on("one", () => {
  console.log("事件2");
});

myEvent.on("one", () => {
  console.log("事件3");
});

myEvent.on("one", () => {
  console.log("事件4");
});

myEvent.emit("one", [1]);
