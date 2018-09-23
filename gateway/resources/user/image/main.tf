variable "api_parent_id" {}
variable "rest_api_id" {}
variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "lambda_role" {}
variable "dynamodb_table_name" {}

# image resources for get (list), post, put and delete
resource "aws_api_gateway_resource" "image" {
  path_part   = "image"
  parent_id   = "${var.api_parent_id}"
  rest_api_id = "${var.rest_api_id}"
}

# options configuration for image
resource "aws_api_gateway_method" "options_method_image" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.image.id}"
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_200_image" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.image.id}"
  http_method = "${aws_api_gateway_method.options_method_image.http_method}"
  status_code = "200"

  response_models {
    "application/json" = "Empty"
  }

  response_parameters {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  depends_on = ["aws_api_gateway_method.options_method_image"]
}

resource "aws_api_gateway_integration" "options_integration_image" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.image.id}"
  http_method = "${aws_api_gateway_method.options_method_image.http_method}"
  type        = "MOCK"
  depends_on  = ["aws_api_gateway_method.options_method_image"]

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response_image" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.image.id}"
  http_method = "${aws_api_gateway_method.options_method_image.http_method}"
  status_code = "${aws_api_gateway_method_response.options_200_image.status_code}"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = ["aws_api_gateway_method_response.options_200_image"]
}

# image get resource with id only
resource "aws_api_gateway_resource" "imageId" {
  path_part   = "{imageId}"
  parent_id   = "${aws_api_gateway_resource.image.id}"
  rest_api_id = "${var.rest_api_id}"
}

# options configuration for imageId
resource "aws_api_gateway_method" "options_method_image_id" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.imageId.id}"
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_200_image_id" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.imageId.id}"
  http_method = "${aws_api_gateway_method.options_method_image_id.http_method}"
  status_code = "200"

  response_models {
    "application/json" = "Empty"
  }

  response_parameters {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  depends_on = ["aws_api_gateway_method.options_method_image_id"]
}

resource "aws_api_gateway_integration" "options_integration_image_id" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.imageId.id}"
  http_method = "${aws_api_gateway_method.options_method_image_id.http_method}"
  type        = "MOCK"
  depends_on  = ["aws_api_gateway_method.options_method_image_id"]
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response_image_id" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.imageId.id}"
  http_method = "${aws_api_gateway_method.options_method_image_id.http_method}"
  status_code = "${aws_api_gateway_method_response.options_200_image_id.status_code}"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = ["aws_api_gateway_method_response.options_200_image_id"]
}

# get integration
resource "aws_api_gateway_method" "get" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.image.id}"
  http_method   = "GET"
  authorization = "NONE"

  request_parameters {
    "method.request.path.imageId" = true
    "method.request.path.userId"  = true
  }
}

resource "aws_api_gateway_integration" "get" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.image.id}"
  http_method             = "${aws_api_gateway_method.get.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.app_region}:lambda:path/2015-03-31/functions/${module.get_lambda.arn}/invocations"

  request_parameters {
    "integration.request.path.imageId" = "method.request.path.imageId"
    "integration.request.path.userId"  = "method.request.path.userId"
  }
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

  dynamodb_table_name = "${var.dynamodb_table_name}"
}

# get with id integration
resource "aws_api_gateway_method" "get_with_id" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.imageId.id}"
  http_method   = "GET"
  authorization = "NONE"

  request_parameters {
    "method.request.path.imageId" = true
    "method.request.path.userId"  = true
  }
}

resource "aws_api_gateway_integration" "get_with_id" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.imageId.id}"
  http_method             = "${aws_api_gateway_method.get_with_id.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.app_region}:lambda:path/2015-03-31/functions/${module.get_with_id_lambda.arn}/invocations"

  request_parameters {
    "integration.request.path.imageId" = "method.request.path.imageId"
    "integration.request.path.userId"  = "method.request.path.userId"
  }
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

  dynamodb_table_name = "${var.dynamodb_table_name}"
}

# post integration
resource "aws_api_gateway_method" "post" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.image.id}"
  http_method   = "POST"
  authorization = "NONE"

  request_parameters {
    "method.request.path.imageId" = true
    "method.request.path.userId"  = true
  }
}

resource "aws_api_gateway_method_response" "post_response_200" {
  rest_api_id           = "${var.rest_api_id}"
  resource_id           = "${aws_api_gateway_resource.image.id}"
  http_method           = "${aws_api_gateway_method.post.http_method}"
  status_code           = "200"
  response_parameters = {
      "method.response.header.Access-Control-Allow-Origin" = true
  }
  depends_on            = ["aws_api_gateway_method.post", "aws_api_gateway_integration.post"]
}

resource "aws_api_gateway_integration" "post" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.image.id}"
  http_method             = "${aws_api_gateway_method.post.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.app_region}:lambda:path/2015-03-31/functions/${module.post_lambda.arn}/invocations"

  request_parameters {
    "integration.request.path.imageId" = "method.request.path.imageId"
    "integration.request.path.userId"  = "method.request.path.userId"
  }
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

  dynamodb_table_name = "${var.dynamodb_table_name}"
}
