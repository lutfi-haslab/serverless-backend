import { nanoid, prisma, validateData } from "../libs/index.js";

const seed = async () => {
  const collection = await prisma.beCollection.create({
    data: {
      id: `collection-${nanoid()}`,
      collection_name: "test2",
      schema: {
        name: "string",
        address: "string",
        phone: "number",
      },
    },
  });

  const dataInput = {
    name: "lutfi",
    address: "Karawang",
    phone: "12345678"
  }
  validateData(collection.schema, dataInput);
  const document = await prisma.beDocument.create({
    data: {
      id: `doc-${nanoid()}`,
      collectionId: collection.id,
      data: dataInput
    },
  });

  const data = await prisma.beCollection.findMany({
    include: {
      document: true,
    },
  });

  console.log(data);

  return data;
};

seed();


