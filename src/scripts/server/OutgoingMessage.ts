export default class OutgoingMessage<T>{
    data: T;
    status: number;

    constructor(data: any, status: number = 200) {
        this.data = data;
        this.status = status;
    }
}