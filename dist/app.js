"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http = __importStar(require("http"));
const router_1 = require("./router");
const errors_1 = require("./errors");
const PORT = Number(process.env.PORT) || 5500;
const server = http.createServer(async (req, res) => {
    try {
        await (0, router_1.router)(req, res);
    }
    catch (error) {
        if (error instanceof errors_1.UuidError) {
            res.writeHead(400, { "Content-Type": "application/json" });
        }
        else if (error instanceof errors_1.FieldsRequiredError) {
            res.writeHead(400, { "Content-Type": "application/json" });
        }
        else if (error instanceof errors_1.NoUserError) {
            res.writeHead(404, { "Content-Type": "application/json" });
        }
        else {
            res.writeHead(500, { "Content-Type": "application/json" });
            error.message = "Internal Server Error";
        }
        console.log(error.message);
        res.write(JSON.stringify({ "message": `${error.message}` }));
        res.end();
    }
});
server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});
