"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookAuthentication = void 0;
const webhookAuthentication = (req, res, next) => {
    const secretKey = req.body.secretKey;
    if (secretKey === process.env.WEBHOOK_SECRET_KEY) {
        next();
    }
    else {
        res.status(401).send('Unauthorized');
    }
};
exports.webhookAuthentication = webhookAuthentication;
