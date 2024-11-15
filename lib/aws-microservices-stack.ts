import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {AttributeType, BillingMode, Table} from "aws-cdk-lib/aws-dynamodb";
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {join} from "path";
import {NodejsFunction, NodejsFunctionProps} from "aws-cdk-lib/aws-lambda-nodejs";

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Aqui va todo nuestra logica de configuracion
      //dynamoDB
      const ProductTable = new Table(
        this, 'product' , {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: 'product',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST

        });
      // Lambda
      const nodeJsFuctionProps: NodejsFunctionProps = {
          bundling :{
              externalModules: ['aws-sdk'],
          },
          environment: {
                TABLE_NAME: ProductTable.tableName,
                PRIMARY_KEY: 'id'
          },
            runtime: Runtime.NODEJS_14_X,
      }
      // funtion for product
 const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
    entry: join(__dirname, '../src/product/index.ts'),
     ...nodeJsFuctionProps,
 });
// grant permission to lambda to access dynamoDB
      ProductTable.grantReadWriteData(productFunction)
  }
}
