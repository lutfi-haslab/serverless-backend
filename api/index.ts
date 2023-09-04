import "dotenv/config";
import Fastify, { FastifyRequest } from "fastify";
import { prisma, nanoid, validateData } from "./libs/index";

const server = Fastify({
  logger: true,
});

server.get("/ping", async (req, res) => {
  return { pong: "it worked!" };
});

// Add Collection
server.post(
  "/collection",
  async (
    req: FastifyRequest<{
      Body: {
        name: string;
        schema: string;
      };
    }>,
    res
  ) => {
    const { name, schema } = req.body;

    try {
      const collection = await prisma.collection.create({
        data: {
          id: `collection-${nanoid()}`,
          collection_name: name,
          schema,
        },
      });

      return collection;
    } catch (error) {
      return JSON.stringify(error);
    }
  }
);

// Get Collection
server.get(
  "/collection",
  async (
    req: FastifyRequest<{
      Querystring: {
        name: string;
      };
    }>,
    res
  ) => {
    const { name } = req.query;

    try {
      if (name) {
        const collection = await prisma.collection.findFirst({
          where: {
            collection_name: name,
          },
        });

        return collection;
      }

      const collection = await prisma.collection.findMany();
      return collection;
    } catch (error) {
      return JSON.stringify(error);
    }
  }
);

const start = async () => {
  try {
    await server.listen({ port: 3006, host: "0.0.0.0" });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Server listening at ${address} and port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export default start();