"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const controller_1 = require("./controller");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
async function router(req, res) {
    const parsedUrlLeangth = req.url?.split("/").length;
    if (req.url === "/api/users" && req.method === "GET") {
        const users = await new controller_1.Controller().getUsers();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(users));
        res.end();
    }
    else if (parsedUrlLeangth === 4 && req.url?.match(/\/api\/users\/.+/) && req.method === "GET") {
        const idFromReq = req.url.split("/")[3];
        const isValidUuid = (0, utils_1.validateUuid)(idFromReq);
        if (isValidUuid) {
            const user = await new controller_1.Controller().getUser(idFromReq);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(user));
            res.end();
        }
        else {
            throw new errors_1.UuidError;
        }
    }
    else if (req.url === "/api/users" && req.method === "POST") {
        let userData = await (0, utils_1.getRequestData)(req);
        if (typeof userData === "string") {
            let user = await new controller_1.Controller().createUser(JSON.parse(userData));
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
        }
    }
    else if (parsedUrlLeangth === 4 && req.url?.match(/\/api\/users\/.+/) && req.method === "DELETE") {
        const idFromReq = req.url.split("/")[3];
        const isValidUuid = (0, utils_1.validateUuid)(idFromReq);
        if (isValidUuid) {
            await new controller_1.Controller().deleteUser(idFromReq);
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end();
        }
        else {
            throw new errors_1.UuidError;
        }
    }
    else if (parsedUrlLeangth === 4 && req.url?.match(/\/api\/users\/.+/) && req.method === "PUT") {
        const idFromReq = req.url.split("/")[3];
        const isValidUuid = (0, utils_1.validateUuid)(idFromReq);
        let userData = await (0, utils_1.getRequestData)(req);
        if (isValidUuid) {
            if (typeof userData === "string") {
                let user = await new controller_1.Controller().updateUser(idFromReq, JSON.parse(userData));
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(user));
            }
        }
        else {
            throw new errors_1.UuidError;
        }
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}
exports.router = router;
