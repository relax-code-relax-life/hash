# 依赖
node.js 8.x

# 下载
npm install wwl-hash

# 使用
let { hashFile , hashFileSync , hashContent , hashContentSync , stream , algorithms } = require('wwl-hash');

# API

## algorithms
Array\<string\>

支持的hash方法。 例如: 'md5' , 'sha' 等。

## hashFile
function( filePath:string|Buffer|URL, algorithm:string, callback:function(err:Error,data:string) ) :undefined

异步的获取文件hash值。
```javascript
const filePath = 'test.txt';
hash.hashFile(filePath, 'md5', (err, md5) => {
    console.log(md5);
})
```

## hashFileSync
function(filePath, algorithm):string

对应hashFile()的同步方法。返回hash值。

## hashContent
function (content:string, algorithm:string, callback:function(err:Error,data:string)) :undefined

异步的获取传入文本的hash值。

```javascript
hash.hashContent('testContent', 'md5', (err, md5) => {
   console.log(md5);
   //"bae941e0d1cdf42b75d6d0ef6bd7d25a"
})
```

## hashContentSync
function (content, algorithm):string

对应hashContent()的同步方法，返回hash值。

## stream
function (algorithm:string, callback:function(err:Error,data:string)):stream.Writable

该方法返回一个可写流(准确的说，是Hash实例)，计算写入流的数据的hash值。
```javascript
var stream = hash.stream('md5', (err, md5) => {
    console.log(md5);
    //"bae941e0d1cdf42b75d6d0ef6bd7d25a"
});
stream.end('testContent');
```






