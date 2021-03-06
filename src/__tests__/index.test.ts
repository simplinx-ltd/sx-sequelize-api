import { ApiError } from '../api.error';
import { ModelRestApi } from '../api.rest';
import { CryptText } from '../crypt.text';

import * as index from '../index';

describe('Test Index', (): void => {
    test('calls ApiError', (): void => {
        expect(index.ApiError).toEqual(ApiError);
    });

    test('calls ModelRestApi', (): void => {
        expect(index.ModelRestApi).toEqual(ModelRestApi);
    });

    test('calls CryptText', (): void => {
        expect(index.CryptText).toEqual(CryptText);
    });
});
