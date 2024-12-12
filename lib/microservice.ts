import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface EcommerceMicroserviceProps {
  ProductTable: ITable;
}

export class EcommerceMicroservice extends Construct {
  public readonly productMicroservice: NodejsFunction;

  constructor(scope: Construct, id: string, props: EcommerceMicroserviceProps) {
    super(scope, id);

    const nodeJsFuctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "id",
        DYNAMODB_TABLE_NAME: props.ProductTable.tableName,
      },
      runtime: Runtime.NODEJS_LATEST,
    };
    const productFunction = new NodejsFunction(this, "productLambdaFunction", {
      entry: join(__dirname, "../src/product/index.ts"),
      ...nodeJsFuctionProps,
    });
    // grant permission to lambda to access dynamoDBC
    props.ProductTable.grantReadWriteData(productFunction);

    this.productMicroservice = productFunction;
  }
}
