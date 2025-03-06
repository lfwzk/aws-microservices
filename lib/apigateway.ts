import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface EcommerceApiGatewayProps {
  productMicroservice: IFunction;
  basketMicroservice: IFunction;
}

export class EcommerceApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: EcommerceApiGatewayProps) {
    super(scope, id);

    this.createProductApiGateway(props.productMicroservice);
    this.createBasketApiGateway(props.basketMicroservice);
  }
  private createProductApiGateway(productMicroservice: IFunction) {
    const apigateway = new LambdaRestApi(this, "productApi", {
      restApiName: "Product Service",
      handler: productMicroservice,
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

  private  createBasketApiGateway(basketMicroservice: IFunction) {
  // Basket microservice api gateway
  // root name : basket
  // GET /basket
  // POST /basket

  // resource name : basket/{username}
  // GET /basket/{username}
  // DELETE /basket/{username}

  // POST /basket/checkout
    const apigateway = new LambdaRestApi(this, "basketApi", {
        restApiName: "Basket Service",
        handler: basketMicroservice,
        proxy: false,
    });
    const basket = apigateway.root.addResource("basket");
    basket.addMethod("GET");
    basket.addMethod("POST"); // POST /basket

    const singleBasket = basket.addResource("{username}");
    singleBasket.addMethod("GET"); // GET /basket/{username}
    singleBasket.addMethod("DELETE"); // DELETE /basket/{username}

    const basketCheckout = basket.addResource("checkout");
    basketCheckout.addMethod("POST"); // POST /basket/checkout
    // expect payload { username: "username" }



  }

}
