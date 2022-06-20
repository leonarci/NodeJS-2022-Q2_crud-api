import 'dotenv/config'
import * as http from 'http';
import { router } from './router';
import cluster from 'cluster';
import os from 'os';
import { server } from './app';
import { FieldsRequiredError, NoUserError, UuidError } from './errors';

const pid = process.pid;
const PORT: number = Number(process.env.PORT) || 5500;

if (cluster.isMaster) {
  const count: number = os.cpus().length;
  console.log(`Master pid: ${pid}`);
  console.log(`Starting ${count} forks`);
  cluster.schedulingPolicy = cluster.SCHED_RR;
  for (let i = 0; i < count; i++) cluster.fork();
} else {
  const id = cluster.worker?.id;
  console.log(`Worker id: ${id}, pid: ${pid}, port: ${PORT}`);
  (async () => {
    await import('./app')
  })();
}

