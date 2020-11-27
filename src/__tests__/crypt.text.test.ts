import { CryptText } from '../crypt.text';

describe('CryptText Class Tests', (): void => {
    describe('crypt Function Tests', (): void => {
        test('Test crypt Function', (done): void => {
            let text = 'thisIsATestTextString';
            let key = 'thisIsATestKeyString';
            let expectedCryptedString = 'a0c4ab7b5c3ae1e57bffec74d32c88754cadfe27d18f9ad030d7f08dc1b49542';
            expect(CryptText.crypt(text, key)).toEqual(expectedCryptedString);
            done();
        });

        test('Test crypt Function With Empty String', (done): void => {
            let text = '';
            let key = 'thisIsATestKeyString';
            expect(CryptText.crypt(text, key)).toEqual('');
            done();
        });
    });

    describe('CryptText Class Tests', (): void => {
        test('Test decrypt Function', (done): void => {
            let encText = 'a0c4ab7b5c3ae1e57bffec74d32c88754cadfe27d18f9ad030d7f08dc1b49542';
            let key = 'thisIsATestKeyString';
            let expectedDecryptedString = 'thisIsATestTextString';
            expect(CryptText.decrypt(encText, key)).toEqual(expectedDecryptedString);
            done();
        });

        test('Test decrypt Function With Empty String', (done): void => {
            let encText = '';
            let key = 'thisIsATestKeyString';
            expect(CryptText.decrypt(encText, key)).toEqual('');
            done();
        });
    });
});
