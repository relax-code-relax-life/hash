// for lower node version.

var crypto = require('crypto');
var fs = require('fs');


var bindHash = function (algorithm, callback) {
    var hash = crypto.createHash(algorithm);
    hash.on('error', callback);
    hash.once('data', function (buf) {
        callback(null, buf.toString('hex'))
    });
    return hash;
};


var hashFile = function (filePath, algorithm, callback) {
    var hash = bindHash(algorithm, callback);
    if (hash === undefined) return;
    var inputStream = fs.createReadStream(filePath);
    inputStream.on('error', callback);
    inputStream.pipe(hash);
};


var hashContent = function (content, algorithm, callback) {
    var hash = bindHash(algorithm, callback);
    if (hash === undefined) return;
    hash.end(content);
};


module.exports = {
    hashFile: hashFile,
    hashContent: hashContent,
    /**
     * @param algorithm
     * @param callback
     * @returns {stream.Writable}
     */
    stream: bindHash
}












