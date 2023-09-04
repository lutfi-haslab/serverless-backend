import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";

export default async function (
  app: FastifyInstance,
  opts: FastifyServerOptions
) {
  app.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    res.status(200).send({
      hello: "World",
    });
  });
}
