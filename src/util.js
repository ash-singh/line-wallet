const util = require('util');
const crypto = require('crypto');

const {crypto_password} = require('./config');

const prettyPrintResponse = (response) => {
    console.log(util.inspect(response, { colors: true, depth: 4 }));
}

const formatError = (error) => {
    return {
        error: { ...error.data, status_code: error.status },
    };
}

const getCryptoKey = () => {
    return crypto.createCipher('aes-128-cbc', crypto_password);
}

const encrypt = (plaintext) => {
    var key = getCryptoKey();
    var encryptedVal = key.update(plaintext, 'utf8', 'hex')
    encryptedVal += key.final('hex');
    return encryptedVal;
}

const decrypt = (encryptedVal) => {
    var key = getCryptoKey();
    var value = key.update(encryptedVal, 'hex', 'utf8')
    value += key.final('utf8');
    return value;
}

const createToken = (length) => {
    return crypto.randomBytes(length).toString('hex');
}


module.exports = {
    prettyPrintResponse: prettyPrintResponse,
    formatError: formatError,
    encrypt: encrypt,
    decrypt: decrypt,
    createToken: createToken
}