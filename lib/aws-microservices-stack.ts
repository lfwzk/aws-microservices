import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { EcommerceDatabase } from "./database";

// TODO: Investigar sobre Proxys

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Aqui va todo nuestra logica de configuracion
    //dynamoDB
    const database = new EcommerceDatabase(this, "database");

    // Lambda
    const nodeJsFuctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "id",
        DYNAMODB_TABLE_NAME: database.ProductTable.tableName,
      },
      runtime: Runtime.NODEJS_LATEST,
    };
    // funtion for product
    const productFunction = new NodejsFunction(this, "productLambdaFunction", {
      entry: join(__dirname, "../src/product/index.ts"),
      ...nodeJsFuctionProps,
    });
    // grant permission to lambda to access dynamoDB
    database.ProductTable.grantReadWriteData(productFunction);
    // API_GATEWAY

    const apigateway = new LambdaRestApi(this, "productApi", {
      restApiName: "Product Service",
      handler: productFunction,
      proxy: false,
    });
    const product = apigateway.root.addResource("product");
    product.addMethod("GET"); // GET /product
    product.addMethod("POST"); // POST /product

    const productId = product.addResource("{id}");
    productId.addMethod("GET"); // GET /product/{id}
    productId.addMethod("PUT"); // PUT /product/{id}
    productId.addMethod("DELETE"); // DELETE /product/{id}
  }
}
