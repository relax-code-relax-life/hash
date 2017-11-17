var crypto = require('crypto');
var fs = require('fs');

var hashes = crypto.getHashes();
var validHash = function (algorithm) {
    return hashes.includes(algorithm);
}

var bindHash = function (algorithm, callback) {
    if(!validHash(algorithm)){
       callback(new Error(`Digest method not supported : ${algorithm} .`));
       return undefined;
    }
    var hash = crypto.createHash(algorithm);
    hash.on('error', callback);
    hash.once('data', (buf) => callback(null, buf.toString('hex')));
    return hash;
};


var hashFile = function (filePath, algorithm, callback) {
    var hash = bindHash(algorithm, callback);
    if(hash===undefined) return;
    var inputStream = fs.createReadStream(filePath);
    inputStream.on('error', (err) => callback);
    inputStream.pipe(hash);
};


var hashContent = function (content, algorithm, callback) {
    var hash = bindHash(algorithm, callback);
    if(hash===undefined) return;
    hash.end(content);
};

var maxReadSize = 10240;
var hashFileSync = function (filePath, algorithm) {
    if(!validHash(algorithm)){
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
    }
    finally {
        fs.closeSync(fd);
    }
    return hash.digest('hex');
};

var hashContentSync = function (content, algorithm) {
    if(!validHash(algorithm)){
        throw new Error(`Digest method not supported : ${algorithm} .`);
    }

    var hash = crypto.createHash(algorithm);
    hash.update(content, 'utf8');
    return hash.digest('hex');
}

module.exports = {
    hashFile,
    hashFileSync,
    hashContent,
    hashContentSync,
    /**
     * @param algorithm
     * @param callback
     * @returns {stream.Writable}
     */
    stream: bindHash,
    algorithms:hashes.slice(0)
}












