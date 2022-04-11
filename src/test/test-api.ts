import * as express from 'express';
import { ModelRestApi } from '../';
import { Sequelize } from 'sequelize-typescript';

import TestModel from './test-model';
import { ModelStatic, Model } from 'sequelize';

export default function api(connection: Sequelize): express.Router {
    const router: express.Router = express.Router();
    const DbModel = TestModel;
    const modelApi = new ModelRestApi(DbModel, connection);

    router.get('/', checkUserAccessRight(DbModel), modelApi.getAll());

    router.get('/count', checkUserAccessRight(DbModel), modelApi.count());

    router.get('/:id', checkUserAccessRight(DbModel), modelApi.getById());

    router.post('/', checkUserAccessRight(DbModel), modelApi.create());

    router.put('/:id', checkUserAccessRight(DbModel), modelApi.updateById());

    router.delete('/:id', checkUserAccessRight(DbModel), modelApi.deleteById());

    return router;
}

function checkUserAccessRight(
    model: ModelStatic<Model>,
): (req: express.Request, res: express.Response, next: express.NextFunction) => express.Response | void {
    return (req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void => {
        return next();
    };
}
