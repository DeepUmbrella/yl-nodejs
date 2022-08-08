Buffer.prototype.mySlipt = function (slipt) {
  if (!Buffer.isBuffer(this))
    throw new Error("function Buffer.split need be call by Buffer Object!");

  let arraybuffer = [];
  let buflength = this.length || 0;
  let offset = 0;
  if (buflength) {
    while (this.indexOf(slipt, offset) !== -1) {
      arraybuffer.push(this.slice(offset, this.indexOf(slipt, offset)));
      offset = this.indexOf(slipt, offset) + 1;
    }
    if (offset <= buflength - 1) {
      arraybuffer.push(this.slice(offset));
    }

    return arraybuffer;
  }
  return [];
};

let brf = Buffer.from("efddddddefefefef");
Buffer.mySlipt.call(b1, "e");

console.log(brf.mySlipt("e"));
