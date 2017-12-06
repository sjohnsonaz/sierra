import Context from '../server/Context';

export function bodyParse(context: Context) {
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
                    let bufferedData = Buffer.concat(body).toString();
                    let result = JSON.parse(bufferedData);
                    context.body = result;
                    resolve(result);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}