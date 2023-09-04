import {
  FastifyInstance,
  RouteShorthandOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { validateData, prisma, nanoid } from "../libs";

async function routes(app: FastifyInstance, options: RouteShorthandOptions) {
  // Add Collection
  app.post(
    "/",
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
  app.get(
    "/",
    async (
      req: FastifyRequest<{
        Querystring: {
          name: string;
          collectionId: string;
        };
      }>,
      res
    ) => {
      const { name, collectionId } = req.query;

      try {
        if (name) {
          const collection = await prisma.collection.findFirst({
            where: {
              collection_name: name,
            },
            include: {
              document: true,
            },
          });

          const reformattedCollection = {
            ...collection,
            document: collection?.document.map((doc) => ({
              id: doc.id,
              // @ts-ignore
              ...doc?.data,
            })),
          };
          return reformattedCollection;
        }

        if (collectionId) {
          const collection = await prisma.collection.findFirst({
            where: {
              collection_name: name,
            },
            include: {
              document: true,
            },
          });

          const reformattedCollection = {
            ...collection,
            document: collection?.document.map((doc) => ({
              id: doc.id,
              // @ts-ignore
              ...doc?.data,
            })),
          };
          return reformattedCollection;
        }

        const collection = await prisma.collection.findMany({
          include: {
            document: true,
          },
        });

        return collection;
      } catch (error) {
        return JSON.stringify(error);
      }
    }
  );
}

export default routes;
