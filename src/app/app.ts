import 'dotenv/config'
import * as http from 'http';
import { router } from './router';
import { FieldsRequiredError, NoUserError, UuidError } from './errors';

const PORT: number = Number(process.env.PORT) || 5500;
const server = http.createServer(async (req, res) => {
  try {
    await router(req, res);
  } catch (error: any) {
    if (error instanceof UuidError) {
      res.writeHead(400, { "Content-Type": "application/json" });
    }
    else if (error instanceof FieldsRequiredError) {
      res.writeHead(400, { "Content-Type": "application/json" });
    }
    else if (error instanceof NoUserError) {
      res.writeHead(404, { "Content-Type": "application/json" });
    }
    else {
      res.writeHead(500, { "Content-Type": "application/json" })
      error.message = "Internal Server Error"
    }
    console.log(error.message)
    res.write(JSON.stringify({ "message": `${error.message}` }))
    res.end()
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

export { server }
