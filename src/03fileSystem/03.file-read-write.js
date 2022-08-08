const fs = require("fs");
const path = require("path");

// read : 读取数据到内存中
// write : 把内存中的数据写入到磁盘在中去

//* 定义 buffer

// const buf = Buffer.alloc(10);

// fs.open(path.resolve("./htmldata.txt"), "r+", (err, fd) => {
//   if (err) throw err;
//   console.log(fd);
//   fs.read(fd, buf, 0, 10, 3, (err, readbytes, buffer) => {
//     console.log(err, readbytes, buffer);
//   });
//   fs.close(fd, () => {
//     if (err) throw err;
//     console.log("关闭成功！");
//   });
// });

class ReadWriteStream {
  static addFilenumber = async function (
    ReadWriteStreamObj,
    filePath,
    bufferOptions
  ) {
    await new Promise((resolve, reject) => {
      fs.open(filePath, "r+", (err, fd) => {
        console.log(fd, err, filePath);
        if (err) {
          reject(err);
          throw err;
        }
        ReadWriteStreamObj.fds[fd] = filePath;
        ReadWriteStreamObj.files[filePath] = fd;
        ReadWriteStreamObj.buffers[fd] = Buffer.alloc(
          bufferOptions.size,
          bufferOptions.fill || undefined,
          bufferOptions.encoding || undefined
        );
        ReadWriteStreamObj.bufferOffset[fd] = 0;
        ReadWriteStreamObj.bufferSize[fd] = bufferOptions.size;
        resolve(fd);
      });
    });
  };
  static deleteAndCloseStream = async function (ReadWriteStreamObj, fd) {
    await fs.close(fd, (err) => {
      if (err) throw err;
      if (ReadWriteStreamObj.fds[fd]) {
        ReadWriteStreamObj.fds[fd] = null;
        delete ReadWriteStreamObj.fds[fd];
      }
      if (ReadWriteStreamObj.buffers[fd]) {
        ReadWriteStreamObj.buffers[fd] = null;
        delete ReadWriteStreamObj.buffers[fd];
      }
      if (ReadWriteStreamObj.bufferOffset[fd]) {
        ReadWriteStreamObj.bufferOffset[fd] = null;
        delete ReadWriteStreamObj.bufferOffset[fd];
      }
      if (ReadWriteStreamObj.bufferSize[fd]) {
        ReadWriteStreamObj.bufferSize[fd] = null;
        delete ReadWriteStreamObj.bufferSize[fd];
      }

      console.log("id:%d关闭成功", fd);
    });
  };
  static readDatabytes = async function (ReadWriteStreamObj, fd, size) {
    let currentbuf = Buffer.alloc(size);
    if (!ReadWriteStreamObj.bufferStatus[fd]) {
      await fs.read(
        fd,
        ReadWriteStreamObj.buffers[fd],
        0,
        size,
        ReadWriteStreamObj.bufferOffset[fd],
        (err, readbytes, buffer) => {
          if (err) throw err;
          currentbuf = buffer;
          if (readbytes !== 0 && readbytes < size) {
            ReadWriteStreamObj.bufferStatus[fd] = true;
            ReadWriteStreamObj.bufferOffset[fd] += readbytes;
          } else {
            ReadWriteStreamObj.bufferOffset[fd] += size;
          }
        }
      );
      return currentbuf;
    }
    console.log("当前文件id:%d 已经读完", fd);
    return null;
  };

  bufferSize = {};
  fds = { 5: "./01.tohtml.html" };
  files = {};
  buffers = {};
  bufferOffset = {};
  bufferStatus = {};

  constructor(arg, bufferOptions = { size: 10 }) {
    this.addStream(arg, bufferOptions);
  }
  readfileByFd = (fd) => {
    return ReadWriteStream.readDatabytes(this, fd, this.bufferSize[fd]);
  };
  readfileByFilePath = (filePath) => {
    if (this.files[filePath]) {
      return this.readfileByFd(this.files[filePath]);
    }
    console.log("此文件已关闭,或不可用");
    return null;
  };
  readAllFileDataBetys = () => {
    return Object.keys(this.fds).map((fd) => this.readfileByFd(fd));
  };
  checkFileReadStatus = () => {
    for (const key in this.bufferStatus) {
      if (Object.hasOwnProperty.call(this.bufferStatus, key)) {
        if (!this.bufferStatus[key]) {
          return {
            allFileReadCompleted: false,
            bufferStatus: this.bufferStatus,
          };
        }
      }
    }
    return {
      allFileReadCompleted: false,
      bufferStatus: this.bufferStatus,
    };
  };

  closeByfd = (fd) => {
    if (this.fds[fd]) {
      ReadWriteStream.deleteAndCloseStream(this, fd);
    }
  };
  closeByfilePath = (filePath) => {
    if (this.files[filePath]) {
      ReadWriteStream.deleteAndCloseStream(this, this.files[filePath]);
      this.files[filePath] = null;
      delete this.files[filePath];
    }
  };

  closeAll = () => {
    Object.keys(this.files).map((filePath) => this.closeByfilePath(filePath));
  };

  addStream = (files, bufferOptions = { size: 10 }) => {
    console.log(this, "this");
    if (typeof files === "string") {
      ReadWriteStream.addFilenumber(this, files, bufferOptions);
    } else if (
      Array.isArray(files) &&
      !files.some((path) => typeof path !== "string")
    ) {
      files.forEach((path) =>
        ReadWriteStream.addFilenumber(this, path, bufferOptions)
      );
    } else {
      throw new Error(
        "argments need 1 type of string|string[] or argments type error"
      );
    }
  };
}

const read = new ReadWriteStream(path.resolve("./htmldata.txt"));

class syncClass {
  static async request() {
    const res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 3000);
    });
    return 1;
  }
  number;

  constructor() {
    this.number = syncClass.request();
  }
}

const data = new syncClass();

console.log(data);
