import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface EcommerceApiGatewayProps {
  productMicroservice: IFunction;
}

export class EcommerceApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: EcommerceApiGatewayProps) {
    super(scope, id);

    const apigateway = new LambdaRestApi(this, "productApi", {
      restApiName: "Product Service",
      handler: props.productMicroservice,
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
