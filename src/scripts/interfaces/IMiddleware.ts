//import * as express from 'express';
//express.RequestHandler;

export interface IMiddleware {
    (...args: any[]): any;
}