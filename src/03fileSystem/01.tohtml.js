const fs = require("fs");
const path = require("path");
const browserSync = require("browser-sync");

const contantPath = path.resolve(__dirname, process.argv[2]);
const stylePath = path.resolve(__dirname, "./style.css");
const htmlPath = path.resolve(__dirname, "./01.tohtml.html");
const temp = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>{{style}}</style>
</head>
<body>
  <div class="header">
    <span>header</span>
    <span>{{content}}</span>
  </div>
</body>
</html>`;
function syncStyleAndContentToHtml() {
  fs.readFile(contantPath, "utf-8", (err, data) => {
    let htmlcontent = data;
    fs.readFile(stylePath, "utf-8", (err, data) => {
      let realhtml = temp
        .replace("{{content}}", htmlcontent)
        .replace("{{style}}", data);
      fs.writeFile(htmlPath, realhtml, () =>
        console.log("html 文件写入成功！")
      );
    });
  });
}

function MywatchFile(filenameArr) {
  syncStyleAndContentToHtml();
  if (filenameArr) {
    filenameArr.map((filePath) => {
      console.log(`当前文件${filePath} 正在被监听`);

      fs.watchFile(filePath, (curr, prev) => {
        syncStyleAndContentToHtml();
        console.log(`${filePath} 已发生变化 正在同步中******`);
      });
    });
  }
  return void 0;
}

MywatchFile([contantPath, stylePath]);

browserSync.init(
  {
    browser: "",
    server: __dirname,
    watch: true,
    index: path.basename(htmlPath),
  },
  (err) => {
    if (err) throw new Error("启动失败");
  }
);
