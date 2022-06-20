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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const pid = process.pid;
const PORT = Number(process.env.PORT) || 5500;
if (cluster_1.default.isMaster) {
    const count = os_1.default.cpus().length;
    console.log(`Master pid: ${pid}`);
    console.log(`Starting ${count} forks`);
    cluster_1.default.schedulingPolicy = cluster_1.default.SCHED_RR;
    for (let i = 0; i < count; i++)
        cluster_1.default.fork();
}
else {
    const id = cluster_1.default.worker?.id;
    console.log(`Worker id: ${id}, pid: ${pid}, port: ${PORT}`);
    (async () => {
        await Promise.resolve().then(() => __importStar(require('./app')));
    })();
}
