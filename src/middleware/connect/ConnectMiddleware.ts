import * as http from 'http';

import { IMiddleware } from '../../pipeline/IMiddleware';
import { exit } from '../../pipeline/Pipeline';
import Context from '../../server/Context';


export function ConnectMiddleware<T extends Context, U>(
    handleFunction: (
        request: http.IncomingMessage,
        response?: http.ServerResponse,
        next?: (err?: any) => any,
        done?: () => any
    ) => any,
    timeout = 1000
): IMiddleware<T, U, U> {
    return function (context: T, value?: U): Promise<U> {
        return new Promise<U>((resolve, reject) => {
            let interval = setInterval(() => {
                if (context.response.writableEnded) {
                    clearInterval(interval);
                    console.log('Interval Called');
                    resolve(exit() as any);
                }
            }, timeout);

            handleFunction(
                context.request,
                context.response,
                function (err) {
                    clearInterval(interval);
                    if (err) {
                        reject(err);
                    } else {
                        resolve(value);
                    }
                },
                function () {
                    clearInterval(interval);
                    resolve(value);
                }
            );
        });
    }
}