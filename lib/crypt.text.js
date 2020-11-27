"use strict";
/**
 * Encrypt & Decrypt Given Text
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptText = void 0;
const crypto = require("crypto");
const algorithm = 'aes256';
class CryptText {
    /**
     * Crypt Text Function
     * @param  {String} text Text to Encrypt
     * @param  {String} KEY  Salt
     * @return {String}      Encrypted Text
     */
    static crypt(text, KEY) {
        if (!text)
            return '';
        let cipher = crypto.createCipher(algorithm, KEY);
        return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    }
    /**
     * Decrypt Text
     * @param  {String} encText Encrypted Text
     * @param  {String} KEY     Salt
     * @return {String}         Decrypted Text
     */
    static decrypt(encText, KEY) {
        if (!encText)
            return '';
        let decipher = crypto.createDecipher(algorithm, KEY);
        return decipher.update(encText, 'hex', 'utf8') + decipher.final('utf8');
    }
}
exports.CryptText = CryptText;
