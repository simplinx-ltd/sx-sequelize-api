"use strict";
/**
 * err format;
 * {
 *      message:'Err message',
 *      name ' 'ERROR_CODE,
 *      ...
 * }
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRestApi = exports.ExModel = void 0;
const sequelize_1 = require("sequelize");
const sx_api_error_1 = require("sx-api-error");
const Debug = require("debug");
const debug = Debug('api.rest');
class ExModel extends sequelize_1.Model {
}
exports.ExModel = ExModel;
class ModelRestApi {
    constructor(model, connection) {
        this.model = null;
        this.sequelizeModelList = null;
        this.model = model;
        this.sequelizeModelList = connection.models;
    }
    getById(attributesExclude) {
        return (req, res, next) => {
            debug(`getById() with params:${JSON.stringify(req.params)} query:${JSON.stringify(req.query || {})}`);
            let where = req.query && req.query.where ? JSON.parse(req.query.where) : {};
            // Include
            let includeFnResult = this.formatIncludeStr(req.query && req.query.include ? JSON.parse(req.query.include) : []);
            if (includeFnResult.error) {
                debug('getById() include format error.');
                return next(sx_api_error_1.createApiError(sx_api_error_1.commonErrors.EWRONG_FORMAT, 'Include Format Error'));
            }
            let filter = {
                where: where,
                include: includeFnResult.formattedInclude,
            };
            if (req.query.attributes)
                filter.attributes = JSON.parse(req.query.attributes);
            if (attributesExclude) {
                let attributes;
                if (Array.isArray(filter.attributes)) {
                    attributes = {
                        include: filter.attributes,
                        exclude: attributesExclude,
                    };
                }
                else {
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
                .then((result) => {
                debug(`getById() result:${JSON.stringify(result)}`);
                return res.json(result);
            })
                .catch((err) => {
                debug(`getById() error. Err:${JSON.stringify(err.stack)}`);
                return next(err);
            });
        };
    }
    getAll(attributesExclude) {
        return (req, res, next) => {
            debug(`getAll() with query:${JSON.stringify(req.query || {})}`);
            let where = req.query && req.query.where ? JSON.parse(req.query.where) : {};
            // Include
            let includeFnResult = this.formatIncludeStr(req.query && req.query.include ? JSON.parse(req.query.include) : []);
            if (includeFnResult.error) {
                debug('getAll() include format error.');
                return next(sx_api_error_1.createApiError(sx_api_error_1.commonErrors.EWRONG_FORMAT, 'Include Format Error'));
            }
            // Order
            let orderFnResult = this.formatOrderStr(req.query && req.query.order ? JSON.parse(req.query.order) : []);
            if (orderFnResult.error) {
                debug('getAll() order format error.');
                return next(sx_api_error_1.createApiError(sx_api_error_1.commonErrors.EWRONG_FORMAT, 'Order Format Error'));
            }
            let filter = {
                where: where,
                offset: req.query.offset && !isNaN(req.query.offset) ? parseInt(req.query.offset) : 0,
                limit: req.query.limit && !isNaN(req.query.limit)
                    ? parseInt(req.query.limit)
                    : 1000 * 1000 * 1000,
                order: orderFnResult.result,
                include: includeFnResult.formattedInclude,
            };
            if (req.query.attributes)
                filter.attributes = JSON.parse(req.query.attributes);
            if (attributesExclude) {
                let attributes;
                if (Array.isArray(filter.attributes)) {
                    attributes = {
                        include: filter.attributes,
                        exclude: attributesExclude,
                    };
                }
                else {
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
                .then((result) => {
                debug(`getAll() calling findAll() returned ${result.length} items`);
                return res.json(result);
            })
                .catch((err) => {
                debug(`getAll() calling findAll() error. Err:${JSON.stringify(err.stack)}`);
                return next(err);
            });
        };
    }
    count() {
        return (req, res, next) => {
            debug(`count() with query:${JSON.stringify(req.query || {})}`);
            let where = req.query && req.query.where ? JSON.parse(req.query.where) : {};
            let filter = {
                where: where,
                include: this.formatIncludeStr(req.query && req.query.include ? JSON.parse(req.query.include) : []).formattedInclude,
            };
            this.model
                .count(filter)
                .then((result) => {
                debug(`count() result:${JSON.stringify(result)}`);
                return res.json(result);
            })
                .catch((err) => {
                debug(`count() error. Err:${JSON.stringify(err.stack)}`);
                return next(err);
            });
        };
    }
    create(attributesExclude) {
        return (req, res, next) => {
            debug(`create() with body:${JSON.stringify(req.body || {})}`);
            this.model
                .create(req.body)
                .then((result) => {
                debug(`create() result:${JSON.stringify(result)}`);
                let resObject = result.get();
                if (attributesExclude)
                    for (let i = 0; i < attributesExclude.length; i++)
                        delete resObject[attributesExclude[i]];
                return res.json(resObject);
            })
                .catch((err) => {
                debug(`create() error. Err:${JSON.stringify(err.stack)}`);
                return next(err);
            });
        };
    }
    createBulk() {
        return (req, res, next) => {
            debug(`create() with body:${JSON.stringify(req.body || {})}`);
            this.model
                .bulkCreate(req.body, { validate: true })
                .then((result) => {
                debug(`create() result:${JSON.stringify(result)}`);
                return res.json('OK');
            })
                .catch((err) => {
                debug(`create() error. Err:${JSON.stringify(err.stack)}`);
                return next(err);
            });
        };
    }
    updateById(attributesExclude) {
        return (req, res, next) => {
            debug(`updateById() with params:${JSON.stringify(req.params)} body:${JSON.stringify(req.body || {})}`);
            this.model
                .findByPk(req.params.id)
                .then((record) => {
                if (!record) {
                    debug(`updateById() Could not find record.`);
                    return next(sx_api_error_1.createApiError(sx_api_error_1.commonErrors.ERECORD_NOT_FOUND));
                }
                record
                    .update(req.body)
                    .then((result) => {
                    debug(`updateById() result:${JSON.stringify(result)}`);
                    let resObject = result.get();
                    if (attributesExclude)
                        for (let i = 0; i < attributesExclude.length; i++)
                            delete resObject[attributesExclude[i]];
                    return res.json(result.get());
                })
                    .catch((err) => {
                    debug(`updateById()  updateAttributes error. Err:${JSON.stringify(err.stack)}`);
                    return next(err);
                });
            })
                .catch((err) => {
                debug(`updateById() findById error. Err:${JSON.stringify(err.stack)}`);
                return next(err);
            });
        };
    }
    deleteById() {
        return (req, res, next) => {
            debug('deleteById() with params:${JSON.stringify(req.params)}');
            this.model
                .destroy({ where: { id: req.params.id } })
                .then((result) => {
                debug(`deleteById() result:${JSON.stringify(result)}`);
                return res.json(result);
            })
                .catch((err) => {
                debug(`deleteById() error. Err:${JSON.stringify(err.stack)}`);
                return next(err);
            });
        };
    }
    formatIncludeStr(includeArray) {
        if (!Array.isArray(includeArray)) {
            debug(`formatIncludeStr() Format error. Expecting array. includeStr:${JSON.stringify(includeArray)}`);
            return { formattedInclude: null, error: true };
        }
        let include = [];
        for (let i = 0; i < includeArray.length; i++) {
            debug(`formatIncludeStr() formatting include item. includeStr[i]:${JSON.stringify(includeArray[i])}`);
            let includeItem = {
                model: this.sequelizeModelList[includeArray[i].model],
                as: includeArray[i].as,
                attributes: includeArray[i].attributes ? includeArray[i].attributes : undefined,
                where: includeArray[i].where ? includeArray[i].where : undefined,
            };
            if (!includeArray[i].attributes)
                delete includeItem.attributes;
            if (!includeArray[i].as)
                delete includeItem.as;
            if (includeArray[i].include) {
                let result = this.formatIncludeStr(includeArray[i].include);
                if (result.error)
                    return { formattedInclude: null, error: true };
                includeItem.include = result.formattedInclude;
            }
            debug(`formatIncludeStr() formatted include item. includeItem:${JSON.stringify(includeItem)}`);
            include.push(includeItem);
        }
        return { formattedInclude: include, error: false };
    }
    formatOrderStr(orderArray) {
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
                for (let j = 1; j < orderArray[i].length; j++)
                    arr.push(orderArray[i][j]);
                order.push(arr);
            }
            else {
                order.push(orderArray[i]);
            }
            debug(`formatOrderStr() formatted order item. orderItem:`, order[order.length - 1]);
        }
        return { result: order, error: false };
    }
}
exports.ModelRestApi = ModelRestApi;
