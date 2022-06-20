import { IncomingMessage, ServerResponse } from "http";
import { Controller } from './controller';
import { UuidError } from './errors';
import { getRequestData, validateUuid } from './utils';
export async function router(req: IncomingMessage, res: ServerResponse) {
  const parsedUrlLeangth = req.url?.split("/").length;

  if (req.url === "/api/users" && req.method === "GET") {
    const users = await new Controller().getUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(users));
    res.end();
  }

  else if (parsedUrlLeangth === 4 && req.url?.match(/\/api\/users\/.+/) && req.method === "GET") {
    const idFromReq = req.url.split("/")[3];
    const isValidUuid = validateUuid(idFromReq);
    if (isValidUuid) {
      const user = await new Controller().getUser(idFromReq);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(user));
      res.end();
    } else {
      throw new UuidError;
    }
  }

  else if (req.url === "/api/users" && req.method === "POST") {
    let userData = await getRequestData(req);
    if (typeof userData === "string") {
      let user = await new Controller().createUser(JSON.parse(userData));
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user))
    }
  }
  else if (parsedUrlLeangth === 4 && req.url?.match(/\/api\/users\/.+/) && req.method === "DELETE") {
    const idFromReq = req.url.split("/")[3];
    const isValidUuid = validateUuid(idFromReq);
    if (isValidUuid) {
      await new Controller().deleteUser(idFromReq);
      res.writeHead(204, { "Content-Type": "application/json" });
      res.end();
    } else {
      throw new UuidError;
    }
  }

  else if (parsedUrlLeangth === 4 && req.url?.match(/\/api\/users\/.+/) && req.method === "PUT") {
    const idFromReq = req.url.split("/")[3];
    const isValidUuid = validateUuid(idFromReq);
    let userData = await getRequestData(req);
    if (isValidUuid) {
      if (typeof userData === "string") {
        let user = await new Controller().updateUser(idFromReq, JSON.parse(userData));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user))
      }
    } else {
      throw new UuidError;
    }
  }

  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
}
