variable "api_parent_id" {}
variable "rest_api_id" {}
variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "lambda_role" {}
variable "dynamodb_table_names" {
  type        = "list"
}
variable "auth_app_secret" {}


# user resources for get (list), post, put and delete
resource "aws_api_gateway_resource" "graph" {
  path_part   = "graph"
  parent_id   = "${var.api_parent_id}"
  rest_api_id = "${var.rest_api_id}"
}

# options / CORS configuration for graph
resource "aws_api_gateway_method" "options_method_graph" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.graph.id}"
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_200_graph" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.graph.id}"
  http_method = "${aws_api_gateway_method.options_method_graph.http_method}"
  status_code = "200"

  response_models {
    "application/json" = "Empty"
  }

  response_parameters {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  depends_on = ["aws_api_gateway_method.options_method_graph"]
}

resource "aws_api_gateway_integration" "options_integration_graph" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.graph.id}"
  http_method = "${aws_api_gateway_method.options_method_graph.http_method}"
  type        = "MOCK"
  depends_on  = ["aws_api_gateway_method.options_method_graph"]

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response_graph" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.graph.id}"
  http_method = "${aws_api_gateway_method.options_method_graph.http_method}"
  status_code = "${aws_api_gateway_method_response.options_200_graph.status_code}"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token','X-Apollo-Tracing'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,GET,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = ["aws_api_gateway_method_response.options_200_graph"]
}

# integration
resource "aws_api_gateway_method" "graph" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.graph.id}"
  http_method   = "POST"
  authorization = "NONE"

  # request_parameters {
  #   "method.request.path.imageId" = true
  #   "method.request.path.userId"  = true
  # }
}

resource "aws_api_gateway_method_response" "graph_response_200" {
  rest_api_id           = "${var.rest_api_id}"
  resource_id           = "${aws_api_gateway_resource.graph.id}"
  http_method           = "${aws_api_gateway_method.graph.http_method}"
  status_code           = "200"
  response_parameters = {
      "method.response.header.Access-Control-Allow-Origin" = true
  }
  depends_on            = ["aws_api_gateway_method.graph", "aws_api_gateway_integration.graph"]
}

resource "aws_api_gateway_integration" "graph" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.graph.id}"
  http_method             = "${aws_api_gateway_method.graph.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.app_region}:lambda:path/2015-03-31/functions/${module.graph_lambda.arn}/invocations"

  # request_parameters {
  #   "integration.request.path.imageId" = "method.request.path.imageId"
  #   "integration.request.path.userId"  = "method.request.path.userId"
  # }
}

# get lambda
module "graph_lambda" {
  source = "./lambda"

  app_name       = "${var.app_name}"
  app_region     = "${var.app_region}"
  account_id     = "${var.account_id}"
  lambda_role    = "${var.lambda_role}"
  api            = "${var.rest_api_id}"
  gateway_method = "${aws_api_gateway_method.graph.http_method}"
  gateway_name   = "${aws_api_gateway_method.graph.http_method}"
  resource_path  = "${aws_api_gateway_resource.graph.path}"

  dynamodb_table_names = "${var.dynamodb_table_names}"
  auth_app_secret = "${var.auth_app_secret}"
}