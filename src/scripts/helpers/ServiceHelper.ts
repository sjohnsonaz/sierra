export default class ServiceHelper {
    static isService(req, res, next) {
        res.locals.isService = true;
        next();
    }
}
