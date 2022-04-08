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
import { ModelStatic, Model } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
export declare class ModelRestApi {
    private model;
    private sequelizeModelList;
    constructor(model: ModelStatic<Model>, connection: Sequelize);
    getById(attributesExclude?: string[]): (req: Request, res: Response, next: NextFunction) => void;
    getAll(attributesExclude?: string[]): (req: Request, res: Response, next: NextFunction) => void;
    count(): (req: Request, res: Response, next: NextFunction) => void;
    create(attributesExclude?: string[]): (req: Request, res: Response, next: NextFunction) => void;
    createBulk(): (req: Request, res: Response, next: NextFunction) => void;
    updateById(attributesExclude?: string[]): (req: Request, res: Response, next: NextFunction) => void;
    deleteById(): (req: Request, res: Response, next: NextFunction) => void;
    private formatIncludeStr;
    private formatOrderStr;
}
