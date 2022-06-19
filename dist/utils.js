"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUuid = exports.getRequestData = void 0;
const uuid_1 = require("uuid");
const uuid_2 = require("uuid");
function getRequestData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                resolve(body);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.getRequestData = getRequestData;
function validateUuid(uuid) {
    return (0, uuid_1.validate)(uuid) && (0, uuid_2.version)(uuid) === 4;
}
exports.validateUuid = validateUuid;
;
