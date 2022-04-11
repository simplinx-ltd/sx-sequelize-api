"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const __1 = require("../");
const test_model_1 = require("./test-model");
function api(connection) {
    const router = express.Router();
    const DbModel = test_model_1.default;
    const modelApi = new __1.ModelRestApi(DbModel, connection);
    router.get('/', checkUserAccessRight(DbModel), modelApi.getAll());
    router.get('/count', checkUserAccessRight(DbModel), modelApi.count());
    router.get('/:id', checkUserAccessRight(DbModel), modelApi.getById());
    router.post('/', checkUserAccessRight(DbModel), modelApi.create());
    router.put('/:id', checkUserAccessRight(DbModel), modelApi.updateById());
    router.delete('/:id', checkUserAccessRight(DbModel), modelApi.deleteById());
    return router;
}
exports.default = api;
function checkUserAccessRight(model) {
    return (req, res, next) => {
        return next();
    };
}
