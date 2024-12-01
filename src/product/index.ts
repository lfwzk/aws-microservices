import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  GetItemCommand,
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient";
import { v4 as uuidv4 } from "uuid";

interface Event {
  httpMethod?: any;
  pathParameters?: any;
  path?: any;
  body?: string;
}

exports.handler = async function (event: Event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  // metodo switch para manejar las rutas y metodos de la API
  switch (event.httpMethod) {
    case "GET":
      if (event.pathParameters != null) {
        body = await getProduct(event.pathParameters.id); // GET /product/{id}
      } else {
        body = await getAllProducts(); // GET /product
      }
    case "POST":
      body = await createProduct(event); // POST /product
      break;
    case "DELETE":
      body = await deleteProduct(event.pathParameters.id); // DELETE /product/{id}
      break;
    case "PUT":
      body = await updateProduct(event); //   PUT /product/{id}
      break;

    default:
      // por si no puede iterar en el switch
      throw new Error(`Unsupported route: "${event.httpMethod}"`);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello from Product ! You've hit ${event.path}\n`,
  };
};
// TODO: Investigar sobre MARSHALL

const getProduct = async (productId: string) => {
  console.log("getProduct");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      // primary key: id
      Key: marshall({ id: productId }),
    };
    const { Item } = await ddbClient.send(new GetItemCommand(params));
    console.log("Item", Item);
    return Item ? unmarshall(Item) : {};
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const getAllProducts = async () => {
  console.log("getAllProducts");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };
    const { Items } = await ddbClient.send(new ScanCommand(params));
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
// createProduct function
const createProduct = async (event: Event) => {
  console.log(`createProduct event: ${event}`);
  try {
    const productRequest = JSON.parse(<string>event.body);

    const productId = uuidv4();
    productRequest.id = productId;

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(productRequest || {}),
    };
    const createResult = await ddbClient.send(new PutItemCommand(params));
    console.log("createResult", createResult);
    return createResult;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

// deleteProduct function

const deleteProduct = async (productId: string) => {
  console.log(`delete product ${productId}`);
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: productId }),
    };
    const deleteResult = await ddbClient.send(new DeleteItemCommand(params));
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const updateProduct = async (event: Event) => {
  console.log(`updateProduct event: ${event}`);

  try {
    const requestBody = JSON.parse(<string>event.body);
    const objKeys = Object.keys(requestBody);

    console.log(`update product ${event} with ${objKeys}`);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: event.pathParameters.id }),
      UpdateExpression: `SET ${objKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        objKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: requestBody[key],
          }),
          {}
        )
      ),
    };

    const updateResult = await ddbClient.send(new UpdateItemCommand(params));
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};
