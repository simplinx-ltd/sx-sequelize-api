/**
 * err format;
 * {
 *      message:'Err message',
 *      name ' 'ERROR_CODE,
 *      ...
 * }
 */

/**
 *  Request Query format

 {
   where:{},
   order:[],
   offset:10,
   limit: 10,
   attributes:[],
   include:[]

 }

 */

import { Request, Response, NextFunction } from 'express';
import { Model, FindOptions, Includeable, FindAttributeOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { createApiError, commonErrors } from 'sx-api-error';
import * as Debug from 'debug';
import { WhereOptions } from 'sequelize';
const debug = Debug('api.rest');

export class ExModel extends Model {}

interface IncludeArray {
    model: string;
    as: string;
    attributes: string[];
    where: WhereOptions;
    include: IncludeArray[];
}

export class ModelRestApi {
    private model: typeof ExModel = null;
    private sequelizeModelList: {
        [key: string]: typeof Model;
    } = null;

    public constructor(model: typeof ExModel, connection: Sequelize) {
        this.model = model;
        this.sequelizeModelList = connection.models;
    }

    public getById(attributesExclude?: string[]): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            debug(`getById() with params:${JSON.stringify(req.params)} query:${JSON.stringify(req.query || {})}`);

            let where = req.query && req.query.where ? JSON.parse(req.query.where as string) : {};

            // Include
            let includeFnResult = this.formatIncludeStr(
                req.query && req.query.include ? JSON.parse(req.query.include as string) : [],
            );

            if (includeFnResult.error) {
                debug('getById() include format error.');
                return next(createApiError(commonErrors.EWRONG_FORMAT, 'Include Format Error'));
            }

            let filter: FindOptions = {
                where: where,
                include: includeFnResult.formattedInclude,
            };

            if (req.query.attributes) filter.attributes = JSON.parse(req.query.attributes as string);

            if (attributesExclude) {
                let attributes: FindAttributeOptions;
                if (Array.isArray(filter.attributes)) {
                    attributes = {
                        include: filter.attributes,
                        exclude: attributesExclude,
                    };
                } else {
                    filter.attributes = filter.attributes || { include: [], exclude: [] };
                    attributes = {
                        include: filter.attributes.include,
                        exclude: attributesExclude.concat(filter.attributes.exclude),
                    };
                }
                filter.attributes = attributes;
            }

            this.model
                .findByPk(req.params.id, filter)
                .then(
                    (result): Response => {
                        debug(`getById() result:${JSON.stringify(result)}`);
                        return res.json(result);
                    },
                )
                .catch((err): void => {
                    debug(`getById() error. Err:${JSON.stringify(err.stack)}`);
                    return next(err);
                });
        };
    }

    public getAll(attributesExclude?: string[]): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            debug(`getAll() with query:${JSON.stringify(req.query || {})}`);
            let where = req.query && req.query.where ? JSON.parse(req.query.where as string) : {};

            // Include
            let includeFnResult = this.formatIncludeStr(
                req.query && req.query.include ? JSON.parse(req.query.include as string) : [],
            );

            if (includeFnResult.error) {
                debug('getAll() include format error.');
                return next(createApiError(commonErrors.EWRONG_FORMAT, 'Include Format Error'));
            }

            // Order
            let orderFnResult = this.formatOrderStr(
                req.query && req.query.order ? JSON.parse(req.query.order as string) : [],
            );

            if (orderFnResult.error) {
                debug('getAll() order format error.');
                return next(createApiError(commonErrors.EWRONG_FORMAT, 'Order Format Error'));
            }

            let filter: FindOptions = {
                where: where,
                offset: req.query.offset && !isNaN(req.query.offset as any) ? parseInt(req.query.offset as string) : 0,
                limit:
                    req.query.limit && !isNaN(req.query.limit as any)
                        ? parseInt(req.query.limit as string)
                        : 1000 * 1000 * 1000,
                order: orderFnResult.result,
                include: includeFnResult.formattedInclude,
            };

            if (req.query.attributes) filter.attributes = JSON.parse(req.query.attributes as string);

            if (attributesExclude) {
                let attributes: FindAttributeOptions;
                if (Array.isArray(filter.attributes)) {
                    attributes = {
                        include: filter.attributes,
                        exclude: attributesExclude,
                    };
                } else {
                    filter.attributes = filter.attributes || { include: [], exclude: [] };
                    attributes = {
                        include: filter.attributes.include,
                        exclude: attributesExclude.concat(filter.attributes.exclude),
                    };
                }
                filter.attributes = attributes;
            }

            debug(`getAll() calling findAll() with filter: ${JSON.stringify(filter)}`);
            this.model
                .findAll(filter)
                .then(
                    (result: ExModel[]): Response => {
                        debug(`getAll() calling findAll() returned ${result.length} items`);
                        return res.json(result);
                    },
                )
                .catch((err: Error): void => {
                    debug(`getAll() calling findAll() error. Err:${JSON.stringify(err.stack)}`);
                    return next(err);
                });
        };
    }

    public count(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            debug(`count() with query:${JSON.stringify(req.query || {})}`);
            let where = req.query && req.query.where ? JSON.parse(req.query.where as string) : {};
            let filter: FindOptions = {
                where: where,
                include: this.formatIncludeStr(
                    req.query && req.query.include ? JSON.parse(req.query.include as string) : [],
                ).formattedInclude,
            };

            this.model
                .count(filter)
                .then(
                    (result: number): Response => {
                        debug(`count() result:${JSON.stringify(result)}`);
                        return res.json(result);
                    },
                )
                .catch((err: Error): void => {
                    debug(`count() error. Err:${JSON.stringify(err.stack)}`);
                    return next(err);
                });
        };
    }

    public create(attributesExclude?: string[]): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            debug(`create() with body:${JSON.stringify(req.body || {})}`);
            this.model
                .create(req.body)
                .then(
                    (result): Response => {
                        debug(`create() result:${JSON.stringify(result)}`);
                        let resObject = result.get();
                        if (attributesExclude)
                            for (let i = 0; i < attributesExclude.length; i++) delete resObject[attributesExclude[i]];
                        return res.json(resObject);
                    },
                )
                .catch((err: Error): void => {
                    debug(`create() error. Err:${JSON.stringify(err.stack)}`);
                    return next(err);
                });
        };
    }

    public createBulk(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            debug(`create() with body:${JSON.stringify(req.body || {})}`);
            this.model
                .bulkCreate(req.body, { validate: true })
                .then(
                    (result): Response => {
                        debug(`create() result:${JSON.stringify(result)}`);
                        return res.json('OK');
                    },
                )
                .catch((err: Error): void => {
                    debug(`create() error. Err:${JSON.stringify(err.stack)}`);
                    return next(err);
                });
        };
    }

    public updateById(attributesExclude?: string[]): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            debug(`updateById() with params:${JSON.stringify(req.params)} body:${JSON.stringify(req.body || {})}`);
            this.model
                .findByPk(req.params.id)
                .then((record): void => {
                    if (!record) {
                        debug(`updateById() Could not find record.`);
                        return next(createApiError(commonErrors.ERECORD_NOT_FOUND));
                    }

                    record
                        .update(req.body)
                        .then(
                            (result): Response => {
                                debug(`updateById() result:${JSON.stringify(result)}`);
                                let resObject = result.get();
                                if (attributesExclude)
                                    for (let i = 0; i < attributesExclude.length; i++)
                                        delete resObject[attributesExclude[i]];
                                return res.json(result.get());
                            },
                        )
                        .catch((err: Error): void => {
                            debug(`updateById()  updateAttributes error. Err:${JSON.stringify(err.stack)}`);

                            return next(err);
                        });
                })
                .catch((err: Error): void => {
                    debug(`updateById() findById error. Err:${JSON.stringify(err.stack)}`);
                    return next(err);
                });
        };
    }

    public deleteById(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            debug('deleteById() with params:${JSON.stringify(req.params)}');
            this.model
                .destroy({ where: { id: req.params.id } })
                .then(
                    (result: number): Response => {
                        debug(`deleteById() result:${JSON.stringify(result)}`);
                        return res.json(result);
                    },
                )
                .catch((err: Error): void => {
                    debug(`deleteById() error. Err:${JSON.stringify(err.stack)}`);
                    return next(err);
                });
        };
    }

    private formatIncludeStr(includeArray: IncludeArray[]): { formattedInclude: Includeable[]; error: boolean } {
        if (!Array.isArray(includeArray)) {
            debug(`formatIncludeStr() Format error. Expecting array. includeStr:${JSON.stringify(includeArray)}`);
            return { formattedInclude: null, error: true };
        }

        let include = [];
        for (let i = 0; i < includeArray.length; i++) {
            debug(`formatIncludeStr() formatting include item. includeStr[i]:${JSON.stringify(includeArray[i])}`);
            let includeItem: Includeable = {
                model: this.sequelizeModelList[includeArray[i].model],
                as: includeArray[i].as,
                attributes: includeArray[i].attributes ? includeArray[i].attributes : undefined,
                where: includeArray[i].where ? includeArray[i].where : undefined,
            };

            if (!includeArray[i].attributes) delete includeItem.attributes;
            if (!includeArray[i].as) delete includeItem.as;

            if (includeArray[i].include) {
                let result = this.formatIncludeStr(includeArray[i].include);
                if (result.error) return { formattedInclude: null, error: true };
                includeItem.include = result.formattedInclude;
            }
            debug(`formatIncludeStr() formatted include item. includeItem:${JSON.stringify(includeItem)}`);
            include.push(includeItem);
        }
        return { formattedInclude: include, error: false };
    }

    private formatOrderStr(orderArray: string[][]): { result: any[]; error: boolean } {
        if (!Array.isArray(orderArray)) {
            debug(`formatOrderStr() Format error. Expecting array. orderArray:${JSON.stringify(orderArray)}`);
            return { result: null, error: true };
        }

        let order = [];
        for (let i = 0; i < orderArray.length; i++) {
            debug(`formatOrderStr() formatting order item. orderArray[i]:${JSON.stringify(orderArray[i])}`);
            if (orderArray[i][0].indexOf('.') > 0) {
                let index = orderArray[i][0].indexOf('.');
                let arr = [];
                // Problem on nested models with alias
                // arr.push(this.sequelizeModelList[orderArray[i][0].substring(0, index)]);
                arr.push(orderArray[i][0].substring(0, index));
                arr.push(orderArray[i][0].substring(index + 1));
                for (let j = 1; j < orderArray[i].length; j++) arr.push(orderArray[i][j]);
                order.push(arr);
            } else {
                order.push(orderArray[i]);
            }
            debug(`formatOrderStr() formatted order item. orderItem:`, order[order.length - 1]);
        }
        return { result: order, error: false };
    }
}
