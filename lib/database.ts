import {RemovalPolicy} from "aws-cdk-lib";
import {AttributeType, BillingMode, ITable, Table,} from "aws-cdk-lib/aws-dynamodb";
import {Construct} from "constructs";

export class EcommerceDatabase extends Construct {
  public readonly ProductTable: ITable;
  public readonly BasketTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    // Product Table DynamoDB table creation
    const ProductTable = new Table(this, "product", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "product",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.ProductTable = ProductTable;

    // basket table
    // Basket : pk username  -- items (set map object)
    // item 1 { quantity - color - size - product_id - price, product_name }
    // item 2 { quantity - color - size - product_id - price, product_name }
  const basketTable = new Table(this, 'basket', {
    partitionKey: {
      name: 'username',
        type: AttributeType.STRING
    },
    tableName: 'basket',
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: BillingMode.PAY_PER_REQUEST
  });

    this.BasketTable = basketTable;

  }
}
