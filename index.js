var crypto = require('crypto');
var fs = require('fs');
var {promisify} = require('util');

var hashes = crypto.getHashes();
var validHash = function (algorithm) {
    return hashes.includes(algorithm);
}

/**
 * @callback cb
 * @param {Error} error
 * @param {string} data
 */

/**
 * @typedef {(string|Buffer|URL)} filePath
 */


/**
 * @param {string} algorithm
 * @param {cb} callback
 * @returns {stream.Writable}
 */
var bindHash = function (algorithm, callback) {
    if (!validHash(algorithm)) {
        callback(new Error(`Digest method not supported : ${algorithm} .`));
        return undefined;
    }
    var hash = crypto.createHash(algorithm);
    hash.on('error', callback);
    hash.once('data', (buf) => callback(null, buf.toString('hex')));
    return hash;
};


/**
 * @param {filePath} filePath
 * @param {string} algorithm
 * @param {cb} callback
 */
var hashFile = function (filePath, algorithm, callback) {
    var hash = bindHash(algorithm, callback);
    if (hash === undefined) return;
    var inputStream = fs.createReadStream(filePath);
    inputStream.on('error', callback);
    inputStream.pipe(hash);
};


/**
 * @param {string} content
 * @param {string} algorithm
 * @param {cb} callback
 */
var hashContent = function (content, algorithm, callback) {
    var hash = bindHash(algorithm, callback);
    if (hash === undefined) return;
    hash.end(content);
};

var promisifyHashFile = promisify(hashFile);
var promisifyHashContent = promisify(hashContent);

/**
 * @param {filePath} filePath
 * @param {string} [algorithm=md5]
 * @returns {Promise<string>}
 */
var hashFilePromise = function (filePath, algorithm = 'md5') {
    return promisifyHashFile(filePath, algorithm);
}

/**
 * @param {string} content
 * @param {string} [algorithm=md5]
 * @returns {Promise<string>}
 */
var hashContentPromise = function (content, algorithm = 'md5') {
    return promisifyHashContent(content, algorithm);
}

var maxReadSize = 10240;

/**
 * @param {string} filePath
 * @param {string} [algorithm=md5]
 * @returns {string}
 */
var hashFileSync = function (filePath, algorithm = 'md5') {
    if (!validHash(algorithm)) {
        throw new Error(`Digest method not supported : ${algorithm} .`);
    }

    var hash = crypto.createHash(algorithm);
    var buffer = Buffer.alloc(maxReadSize, 0);
    var fd = fs.openSync(filePath, 'r');
    try {
        var byteRead = 0;
        do {
            byteRead = fs.readSync(fd, buffer, 0, maxReadSize);
            hash.update(buffer.slice(0, byteRead));
        } while (byteRead === maxReadSize)
    } finally {
        fs.closeSync(fd);
    }
    return hash.digest('hex');
};

/**
 * @param {string} content
 * @param {string} [algorithm=md5]
 * @returns {string}
 */
var hashContentSync = function (content, algorithm = 'md5') {
    if (!validHash(algorithm)) {
        throw new Error(`Digest method not supported : ${algorithm} .`);
    }

    var hash = crypto.createHash(algorithm);
    hash.update(content, 'utf8');
    return hash.digest('hex');
}


module.exports = {
    hashFile,
    hashFileSync,
    hashFilePromise,
    hashContent,
    hashContentSync,
    hashContentPromise,
    hashStream: bindHash,
    algorithms: hashes.slice(0)
}












