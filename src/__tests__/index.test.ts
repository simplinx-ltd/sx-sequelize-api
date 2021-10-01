import { ModelRestApi } from '../api.rest';

import * as index from '../index';

describe('Test Index', (): void => {
    test('calls ModelRestApi', (): void => {
        expect(index.ModelRestApi).toEqual(ModelRestApi);
    });
});
