/**
 * Encrypt & Decrypt Given Text
 */
export declare class CryptText {
    /**
     * Crypt Text Function
     * @param  {String} text Text to Encrypt
     * @param  {String} KEY  Salt
     * @return {String}      Encrypted Text
     */
    static crypt(text: string | null, KEY: string): string;
    /**
     * Decrypt Text
     * @param  {String} encText Encrypted Text
     * @param  {String} KEY     Salt
     * @return {String}         Decrypted Text
     */
    static decrypt(encText: string | null, KEY: string): string;
}
