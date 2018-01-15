import * as http from 'http';

export interface IHttpResult<T> {
    request: http.ClientRequest;
    response: http.IncomingMessage;
    body: T;
}

export default class HttpUtil {
    static request<T>(url: string, options: http.RequestOptions = {}) {
        console.log('calling: ', url);
        let body = [];
        return new Promise<IHttpResult<T>>((resolve, reject) => {
            console.log('promise');
            let request = http.request(Object.assign({ path: url }, options), (response) => {
                console.log('response...');
                response.setEncoding('utf8');
                response.on('data', (data) => {
                    console.log('response data!');
                    body.push(data);
                });
                response.on('end', () => {
                    console.log('response end!');
                    try {
                        let bufferedData = Buffer.concat(body).toString();
                        let data = JSON.parse(bufferedData);
                        resolve({
                            request: request,
                            response: response,
                            body: data
                        });
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
            request.on('error', (error) => {
                console.log('request error');
                reject(error);
            });
        });
    }
}