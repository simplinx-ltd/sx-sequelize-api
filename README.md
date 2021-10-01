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

# Usage Example

### Model 
```javascript
// models/resource-cpu.ts
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
import Model from '../db/models/resource-cpu';
import { Sequelize } from 'sequelize-typescript';

export default function api(connection: Sequelize): express.Router {
    let router: express.Router = express.Router();
    let DbModel = Model;
    let modelApi = new ModelRestApi(DbModel, connection);

    // router.use(authMiddleware());

    router.get('/', modelApi.getAll());
    router.get('/count', modelApi.count());
    router.get('/:id', modelApi.getById());

    router.post('/', modelApi.create());
    router.put('/:id', modelApi.updateById());
    router.delete('/:id', modelApi.deleteById());


    return router;
}

```