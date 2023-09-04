import "dotenv/config";
import Fastify, { FastifyRequest } from "fastify";
import Collection from "./functions/collection";
import Document from "./functions/document";

const server = Fastify({
  logger: true,
});

server.register(Collection, { prefix: "/db/collection" });
server.register(Document, { prefix: "/db/document" });
server.get("/ping", async (req, res) => {
  return { pong: "it worked!" };
});


const start = async () => {
  try {
    await server.listen({ port: 3030, host: "0.0.0.0" });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Server listening at ${address} and port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export default start();