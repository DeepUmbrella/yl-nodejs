const fs = require("fs");
const path = require("path");

// readfile
function read() {
  fs.readFile(
    path.resolve(__dirname, "./data/fileAPI/data.txt"),
    "utf-8",
    (err, data) => {
      console.log(__dirname);
      console.log(data.toString(), err);
    }
  );
}

// writefile
// fs.writeFile(
//   path.resolve(__dirname, "./data/fileAPI/data.txt"),
//   "hello node js ",
//   {
//     mode: 438,
//     flag: "a+",
//     encoding: "utf-8",
//   },
//   (err, data) => {
//     if (!err) {
//       read();
//     }
//   }
// );

// appendfile
// fs.appendFile(
//   path.resolve(__dirname, "./data/fileAPI/data.txt"),
//   "hello node js ",
//   (err, data) => {
//     if (!err) {
//       read();
//     }
//   }
// );

// copyfile

// fs.copyFile(
//   path.resolve("./data/fileAPI/data.txt"),
//   path.resolve("./data/fileAPI/copydata.txt"),
//   () => console.log("copy file successful!")
// );

// // fs.readFile(path.resolve("./data/fileAPI/copydata.txt"), (err, data) => {
// //   console.log(err, data);
// // });

// watchfile
fs.watchFile(
  path.resolve("./data/fileAPI/data.txt"),
  { interval: 20 },
  (curr, prev) => {
    console.log(curr, "\ncurr");
    console.log(prev, "\nprev");
  }
);

// unwatchfile
fs.unwatchFile(path.resolve("./data/fileAPI/data.txt"), (curr, prev) => {
  console.log("文件监控结束");
});
