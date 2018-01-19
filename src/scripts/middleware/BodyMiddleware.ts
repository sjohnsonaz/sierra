import Context from '../server/Context';

export default class BodyMiddleware {
    static handle(context: Context) {
        let verb = context.request.method.toLowerCase();
        if (verb === 'post' || verb === 'put') {
            let body = [];
            return new Promise<any>((resolve, reject) => {
                try {
                    context.request.on('error', (e) => {
                        reject(e);
                    }).on('data', (data) => {
                        body.push(data);
                    }).on('end', () => {
                        try {
                            let bufferedData = Buffer.concat(body).toString().trim();
                            let result = bufferedData ? JSON.parse(bufferedData) : null;
                            context.body = result;
                            resolve(result);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
    }
}