Sequelize Rest Api Helper
==========================

Create Rest Api for Sequelize Models easily.

# Info

### install

>npm i --save sx-sequelize-api

### Peer Dependencies
* express
* sequelize
* sequelize-typescript

### Functions
* Sequelize Model Rest Api
* Api Error templates
* CryptText Class (for tokens)

# Usage Example

### Model 
```javascript
// db/models/resource-cpu.ts
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

@Table({
    tableName: 'resource-cpu',
    modelName: 'resource-cpu',
    freezeTableName: true,
    timestamps: false,
})
export default class ResourceCpu extends Model<ResourceCpu> {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.BIGINT)
    id: number;

    @Column({
        type: DataType.DATE,
    })
    timestamp: Date;

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
    })
    process: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    value: number;
}

```

### Api
```javascript
// api/resource-cpu.ts
import * as express from 'express';
import { ModelRestApi } from 'sx-sequelize-api';
import { authMiddleware } from './auth';
import Model from '../db/models/resource-cpu';
import { Sequelize } from 'sequelize-typescript';

export default function api(connection: Sequelize): express.Router {
    let router: express.Router = express.Router();
    let DbModel = Model;
    let modelApi = new ModelRestApi(DbModel, connection);

    router.use(authMiddleware());

    router.get('/', modelApi.getAll());
    router.get('/count', modelApi.count());
    router.get('/:id', modelApi.getById());

    router.post('/', modelApi.create());
    router.put('/:id', modelApi.updateById());
    router.delete('/:id', modelApi.deleteById());


    return router;
}

```

### Auth Middleware
```javascript
// api/auth.ts
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';
import * as log4js from 'log4js';
import * as Debug from 'debug';
import { ApiError } from 'sx-sequelize-api';

// Logger
const logger = log4js.getLogger('API-AUTH');

const debug = Debug('Auth');

let credentials = {
    username: null,
    password: null,
};

export { authMiddleware, authLogin, authLogout, getAuthHashCode, setUsernamePassword };

let _hashCode: string = null;

function authMiddleware(): (req: Request, res: Response, next: NextFunction) => void {
    if (!_hashCode) {
        logger.debug('Generating hash Code...');
        _hashCode = crypto.randomBytes(32).toString('hex');
    }

    return (req: Request, res: Response, next: NextFunction): void => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        // If no access token return
        if (!accessToken) {
            debug('Request does not have a access-token.');
            return next(ApiError.accessError());
        }

        // Decrypt Token
        jsonwebtoken.verify(accessToken, _hashCode, (err0: Error /** , decoded: any**/): void => {
            // Can not verify
            if (err0) {
                debug('Can not verify token');
                return next(ApiError.accessError());
            }

            return next();
        });
    };
}

function authLogin(req: Request, res: Response, next: NextFunction): void {
    let username: string = req.body.username || null;
    let password: string = req.body.password || null;

    if (!credentials || !credentials.username || !credentials.password) {
        logger.error('Credentials not set yet');
        return next(ApiError.accessError());
    }

    if (!username || !password) {
        logger.debug(`username or password is null`);
        return next(ApiError.accessError());
    }

    if (password !== credentials.password) {
        logger.warn(`Wrong password for ${username}`);
        return next(ApiError.accessError());
    }

    logger.info(`${username} logged in.`);
    let hash = {
        _hashCode,
    };
    let token = jsonwebtoken.sign(hash, _hashCode, { expiresIn: 180 * 60 * 1000 });
    res.json({ token });
}

function authLogout(req: Request, res: Response): void {
    // Nothing to do
    res.json(true);
}

function getAuthHashCode(): string {
    return _hashCode;
}

function setUsernamePassword(_credentials: { username: string; password: string }): void {
    credentials = _credentials;
}
```