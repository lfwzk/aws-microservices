import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EcommerceDatabase } from "./database";
import { EcommerceMicroservice } from "./microservice";
import { EcommerceApiGateway } from "./apigateway";

// TODO: Investigar sobre Proxys

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Aqui va todo nuestra logica de configuracion
    //dynamoDB
    const database = new EcommerceDatabase(this, "database");

    // Lambda

    const microservices = new EcommerceMicroservice(this, "microservices", {
      productTable: database.productTable,
      basketTable : database.basketTable,
    });

    // API_GATEWAY

    const apigateway = new EcommerceApiGateway(this, "apigateway", {
      productMicroservice: microservices.productMicroservice,
    });
  }
}
