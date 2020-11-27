/**
 * Encrypt & Decrypt Given Text
 */

import * as crypto from 'crypto';

const algorithm = 'aes256';

export class CryptText {
    /**
     * Crypt Text Function
     * @param  {String} text Text to Encrypt
     * @param  {String} KEY  Salt
     * @return {String}      Encrypted Text
     */
    public static crypt(text: string | null, KEY: string): string {
        if (!text) return '';
        let cipher = crypto.createCipher(algorithm, KEY);
        return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    }

    /**
     * Decrypt Text
     * @param  {String} encText Encrypted Text
     * @param  {String} KEY     Salt
     * @return {String}         Decrypted Text
     */
    public static decrypt(encText: string | null, KEY: string): string {
        if (!encText) return '';
        let decipher = crypto.createDecipher(algorithm, KEY);
        return decipher.update(encText, 'hex', 'utf8') + decipher.final('utf8');
    }
}
