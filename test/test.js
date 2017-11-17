const hash = require('../index');
const assert = require('assert');
const path = require('path');

const fileMD5 = 'd32cea12482a11c62d89fc35658371ef',
    fileSHA1 = '04564a009207946615291203c85977712237f4af';

const content = 'testContent';
const contentMD5 = 'bae941e0d1cdf42b75d6d0ef6bd7d25a',
    contentSHA1 = '17513aad503256b7fdc94d613aeb87b8338c433a';

const filePath = path.resolve(__dirname, 'test.txt');


assert.strictEqual(hash.hashFileSync(filePath, 'md5'), fileMD5, 'hashFileSync md5 error');
assert.strictEqual(hash.hashFileSync(filePath, 'sha1'), fileSHA1, 'hashFileSync sha1 error');
assert.strictEqual(hash.hashContentSync(content, 'md5'), contentMD5, 'hashContentSync md5 error');
assert.strictEqual(hash.hashContentSync(content, 'sha1'), contentSHA1, 'hashContentSync sha1 error');


var stream = hash.stream('md5', (err, data) => {
    assert.strictEqual(data, contentMD5, 'stream md5 error');
});
stream.end(content);


hash.hashFile(filePath, 'md5', (err, data) => {
    assert.strictEqual(data, fileMD5, 'hashFile md5 error');
})

hash.hashContent(content, 'md5', (err, data) => {
    assert.strictEqual(data, contentMD5, 'hashFile md5 error');
})

