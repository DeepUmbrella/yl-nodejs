// * 创建指定字节大小的buffer 对象
/**
 *  *使用Buffer.alloc 创建指定大小的buffer对象
 *  *使用Buffer.allocUnsafe 创建不安全的指定大小的buffer对象
 */

const b1 = Buffer.alloc(10);
const b2 = Buffer.allocUnsafe(10);

console.log(b1);
console.log(b2);

// * from （string , 编码格式 ）
// * from ([])
const b3 = Buffer.from("1");

console.log(b3);
