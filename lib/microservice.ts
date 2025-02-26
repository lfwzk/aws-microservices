import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface EcommerceMicroserviceProps {
  productTable: ITable;
  basketTable: ITable;
}

export class EcommerceMicroservice extends Construct {
  public readonly productMicroservice: NodejsFunction;
  public readonly basketMicroservice: NodejsFunction;

  constructor(scope: Construct, id: string, props: EcommerceMicroserviceProps) {
    super(scope, id);

    this.productMicroservice = this.createProductFunction(props.productTable);
    this.basketMicroservice = this.createBasketFunction(props.basketTable);
  }


// funcion de creacion de los productos
  private createProductFunction(productTable: ITable) :NodejsFunction{
    const nodeJsFuctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "id",
        DYNAMODB_TABLE_NAME: productTable.tableName,
      },
      runtime: Runtime.NODEJS_LATEST,
    };
    const productFunction = new NodejsFunction(this, "productLambdaFunction", {
      entry: join(__dirname, "../src/product/index.ts"),
      ...nodeJsFuctionProps,
    });
    // grant permission to lambda to access dynamoDBC
    productTable.grantReadWriteData(productFunction);

    return productFunction;
  }

  private createBasketFunction (basketTable: ITable) : NodejsFunction {
    const basketFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "username",
        DYNAMODB_TABLE_NAME: basketTable.tableName,
      },
      runtime: Runtime.NODEJS_LATEST,
    }
    const basketFunction = new NodejsFunction(this, "basketLambdaFunction", {
      entry: join(__dirname, "../src/basket/index.ts"),
      ...basketFunctionProps,
    });
    // grant permission to lambda to access dynamoDBC
    basketTable.grantReadWriteData(basketFunction);
    return basketFunction;

  }
}
