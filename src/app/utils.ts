import { IncomingMessage } from "http";
import { validate as uuidValidate } from 'uuid';
import { version as uuidVersion } from 'uuid';

export function getRequestData(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    try {
      let body: string = "";
      req.on("data", (chunk: Buffer) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  })
}

export function validateUuid(uuid: string): boolean {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};
