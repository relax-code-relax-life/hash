Creating hash digests of files or strings. Such as md5, sha, and so on.

# Installation

```shell
npm install relax-hash
```

# API

```javascript
const {
    algorithms,
    hashFile, hashFileSync, hashFilePromise,
    hashContent, hashContentSync, hashContentPromise,
    hashStream
} = require('relax-hash');
```

## algorithms

`string[]`

An array of the names of the supported hash algorithms, such as `"md5"`,`"sha256"`.

## hashFile

`function (filePath: string | Buffer | URL, algorithm: string, callback: (err: Error, data: string) => void): void`

```javascript
const filePath = 'test.txt';
hashFile(filePath, 'md5', (err, md5) => {
    console.log(md5);
})
```

## hashFileSync

`function (filePath: string | Buffer | URL, algorithm = 'md5'): string`

```javascript
const md5 = hashFileSync('test.txt');
console.log(md5)
```

## hashFilePromise

`async function (filePath: string | Buffer | URL, algorithm = 'md5'): Promise<string>`

```javascript
hashFilePromise('test.txt').then(md5 => console.log(md5))
```

## hashContent

`function (content: string, algorithm: string, callback: (err: Error, data: string) => void): void`

```javascript
hashContent('testContent', 'md5', (err, md5) => {
    console.log(md5);
    //"bae941e0d1cdf42b75d6d0ef6bd7d25a"
})
```

## hashContentSync

`function (content: string, algorithm = 'md5'): string`

```javascript
console.log(hashContentSync('testContent')); // bae941e0d1cdf42b75d6d0ef6bd7d25a
```

## hashContentPromise

`function (content: string, algorithm = 'md5'): Promise<string>`

```javascript
hashContentPromise('testContent').then(md5 => console.log(md5))
```

## hashStream

`function (algorithm: string, callback: (err: Error, data: string) => void): stream.Writable`

该方法返回一个可写流(准确的说，是Hash实例)，计算写入流的数据的hash值。

```javascript
const stream = hashStream('md5', (err, md5) => {
    console.log(md5);
    //"bae941e0d1cdf42b75d6d0ef6bd7d25a"
});
stream.end('testContent');
```






