import { ApiError, HttpError } from '../api.error';

describe('Api Errors tests', (): void => {
    test('send notFound Error', (done): void => {
        let notFound: HttpError = new HttpError('Not Found', 404);
        expect(ApiError.notFound()).toEqual(notFound);
        done();
    });

    test('send serverError Error', (done): void => {
        let serverError: HttpError = new HttpError('Server Error', 500);
        expect(ApiError.serverError()).toEqual(serverError);
        done();
    });

    test('send accessError Error', (done): void => {
        let accessDenied: HttpError = new HttpError('Access Denied', 401);
        expect(ApiError.accessError()).toEqual(accessDenied);
        done();
    });

    test('Expected accessError without Status', (done): void => {
        let accessDenied: HttpError = new HttpError('Access Denied');
        expect(ApiError.accessError()).toEqual(accessDenied);
        done();
    });
});
