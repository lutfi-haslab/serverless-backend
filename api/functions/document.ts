import {
  FastifyInstance,
  RouteShorthandOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { validateData, prisma, nanoid } from "../libs";

async function routes(app: FastifyInstance, options: RouteShorthandOptions) {
  // Add Document
  app.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: {
          collectionId: string;
          input: string;
        };
      }>,
      res
    ) => {
      const { collectionId, input } = req.body;

      try {
        const collection = await prisma.collection.findUnique({
          where: {
            id: collectionId,
          },
        });

        validateData(collection?.schema, input);

        const document = await prisma.document.create({
          data: {
            id: `doc-${nanoid()}`,
            data: input,
            collectionId,
          },
        });

        return document;
      } catch (error) {
        return JSON.stringify(error);
      }
    }
  );

  // Get Collection
  app.get(
    "/",
    async (
      req: FastifyRequest<{
        Querystring: {
          collectionId: string;
          id: string;
        };
      }>,
      res
    ) => {
      const { id, collectionId } = req.query;

      try {
        if (id) {
          const document = await prisma.document.findFirst({
            where: {
              id
            },
          });

          const reformattedCollection = {
            data: {
              id: document?.id,
              collectionId: document?.collectionId,
              // @ts-ignore
              ...document?.data,
            },
          };
          return reformattedCollection;
        }

        const document = await prisma.document.findMany({
          where: {
            collectionId,
          },
        });

        const reformattedCollection = {
          data: document.map((item) => ({
            id: item.id,
            collectionId: item.collectionId,
            // @ts-ignore
            ...item?.data,
          })),
        };
        return reformattedCollection;
      } catch (error) {
        return JSON.stringify(error);
      }
    }
  );
}

export default routes;
