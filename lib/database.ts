import { RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class EcommerceDatabase extends Construct {
  public readonly ProductTable: ITable;
  public readonly basketTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    // Create Product Table
    this.ProductTable = this.createProductTable();
    // Create Basket Table
    this.basketTable = this.createBasketTable();
  }

  private createProductTable() {
    // Product Table DynamoDB table creation
    // product: PK: id -- name -- description -- price -- image -- category
    const ProductTable = new Table(this, "product", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "product",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    return ProductTable;
  }

  private createBasketTable() {
    // basket: table DynamoDB table creation
    // basket: PK : username --items(set-map object)
    // item1 : {color -- quantity-- price}
    // item2 : {color -- quantity-- price}

    const basketTable = new Table(this, "basket", {
      partitionKey: {
        name: "username",
        type: AttributeType.STRING,
      },
      tableName: " basket",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    return basketTable;
  }
}
