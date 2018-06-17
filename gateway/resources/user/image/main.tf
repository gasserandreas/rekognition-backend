variable "api_parent_id" {}
variable "rest_api_id" {}
variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "lambda_role" {}

# image resources for get (list), post, put and delete
resource "aws_api_gateway_resource" "image" {
  path_part   = "image"
  parent_id   = "${var.api_parent_id}"
  rest_api_id = "${var.rest_api_id}"
}

# image get resource with id only
resource "aws_api_gateway_resource" "imageId" {
  path_part   = "{imageId}"
  parent_id   = "${aws_api_gateway_resource.image.id}"
  rest_api_id = "${var.rest_api_id}"
}

# get integration
resource "aws_api_gateway_method" "get" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.image.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.image.id}"
  http_method             = "${aws_api_gateway_method.get.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.app_region}:lambda:path/2015-03-31/functions/${module.get_lambda.arn}/invocations"
}

# get lambda
module "get_lambda" {
  source = "./get"

  app_name       = "${var.app_name}"
  app_region     = "${var.app_region}"
  account_id     = "${var.account_id}"
  lambda_role    = "${var.lambda_role}"
  api            = "${var.rest_api_id}"
  gateway_method = "${aws_api_gateway_method.get.http_method}"
  gateway_name   = "${aws_api_gateway_method.get.http_method}"
  resource_path  = "${aws_api_gateway_resource.image.path}"
}

# get with id integration
resource "aws_api_gateway_method" "get_with_id" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.imageId.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_with_id" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.imageId.id}"
  http_method             = "${aws_api_gateway_method.get_with_id.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.app_region}:lambda:path/2015-03-31/functions/${module.get_with_id_lambda.arn}/invocations"
}

# get with id lambda
module "get_with_id_lambda" {
  source = "./get_with_id"

  app_name       = "${var.app_name}"
  app_region     = "${var.app_region}"
  account_id     = "${var.account_id}"
  lambda_role    = "${var.lambda_role}"
  api            = "${var.rest_api_id}"
  gateway_method = "${aws_api_gateway_method.get_with_id.http_method}"
  gateway_name   = "${aws_api_gateway_method.get_with_id.http_method}"
  resource_path  = "${aws_api_gateway_resource.imageId.path}"
}

# post integration
resource "aws_api_gateway_method" "post" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.image.id}"
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.image.id}"
  http_method             = "${aws_api_gateway_method.post.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.app_region}:lambda:path/2015-03-31/functions/${module.post_lambda.arn}/invocations"
}

# post lambda
module "post_lambda" {
  source = "./post"

  app_name       = "${var.app_name}"
  app_region     = "${var.app_region}"
  account_id     = "${var.account_id}"
  lambda_role    = "${var.lambda_role}"
  api            = "${var.rest_api_id}"
  gateway_method = "${aws_api_gateway_method.post.http_method}"
  gateway_name   = "${aws_api_gateway_method.post.http_method}"
  resource_path  = "${aws_api_gateway_resource.image.path}"
}