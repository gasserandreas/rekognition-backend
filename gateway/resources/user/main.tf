variable "api_parent_id" {}
variable "rest_api_id" {}
variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "lambda_role" {}
variable "dynamodb_table_name" {}

# user resources for get (list), post, put and delete
resource "aws_api_gateway_resource" "user" {
  path_part   = "user"
  parent_id   = "${var.api_parent_id}"
  rest_api_id = "${var.rest_api_id}"
}

# # options configuration for user
# resource "aws_api_gateway_method" "options_method_user" {
#   rest_api_id   = "${var.rest_api_id}"
#   resource_id   = "${aws_api_gateway_resource.user.id}"
#   http_method   = "OPTIONS"
#   authorization = "NONE"
# }

# resource "aws_api_gateway_method_response" "options_200_user" {
#   rest_api_id = "${var.rest_api_id}"
#   resource_id = "${aws_api_gateway_resource.user.id}"
#   http_method = "${aws_api_gateway_method.options_method_user.http_method}"
#   status_code = "200"

#   response_models {
#     "application/json" = "Empty"
#   }

#   response_parameters {
#     "method.response.header.Access-Control-Allow-Headers" = true
#     "method.response.header.Access-Control-Allow-Methods" = true
#     "method.response.header.Access-Control-Allow-Origin"  = true
#   }

#   depends_on = ["aws_api_gateway_method.options_method_user"]
# }

# resource "aws_api_gateway_integration" "options_integration_user" {
#   rest_api_id = "${var.rest_api_id}"
#   resource_id = "${aws_api_gateway_resource.user.id}"
#   http_method = "${aws_api_gateway_method.options_method_user.http_method}"
#   type        = "MOCK"
#   depends_on  = ["aws_api_gateway_method.options_method_user"]
# }

# resource "aws_api_gateway_integration_response" "options_integration_response_user" {
#   rest_api_id = "${var.rest_api_id}"
#   resource_id = "${aws_api_gateway_resource.user.id}"
#   http_method = "${aws_api_gateway_method.options_method_user.http_method}"
#   status_code = "${aws_api_gateway_method_response.options_200_user.status_code}"

#   response_parameters = {
#     "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
#     "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'"
#     "method.response.header.Access-Control-Allow-Origin"  = "'*'"
#   }

#   depends_on = ["aws_api_gateway_method_response.options_200_user"]
# }

# user get resource with id only
resource "aws_api_gateway_resource" "userId" {
  path_part   = "{userId}"
  parent_id   = "${aws_api_gateway_resource.user.id}"
  rest_api_id = "${var.rest_api_id}"
}

# # options configuration for userId
# resource "aws_api_gateway_method" "options_method_user_id" {
#   rest_api_id   = "${var.rest_api_id}"
#   resource_id   = "${aws_api_gateway_resource.userId.id}"
#   http_method   = "OPTIONS"
#   authorization = "NONE"
# }

# resource "aws_api_gateway_method_response" "options_200_user_id" {
#   rest_api_id = "${var.rest_api_id}"
#   resource_id = "${aws_api_gateway_resource.userId.id}"
#   http_method = "${aws_api_gateway_method.options_method_user_id.http_method}"
#   status_code = "200"

#   response_models {
#     "application/json" = "Empty"
#   }

#   response_parameters {
#     "method.response.header.Access-Control-Allow-Headers" = true
#     "method.response.header.Access-Control-Allow-Methods" = true
#     "method.response.header.Access-Control-Allow-Origin"  = true
#   }

#   depends_on = ["aws_api_gateway_method.options_method_user_id"]
# }

# resource "aws_api_gateway_integration" "options_integration_user_id" {
#   rest_api_id = "${var.rest_api_id}"
#   resource_id = "${aws_api_gateway_resource.userId.id}"
#   http_method = "${aws_api_gateway_method.options_method_user_id.http_method}"
#   type        = "MOCK"
#   depends_on  = ["aws_api_gateway_method.options_method_user_id"]
# }

# resource "aws_api_gateway_integration_response" "options_integration_response_user_id" {
#   rest_api_id = "${var.rest_api_id}"
#   resource_id = "${aws_api_gateway_resource.userId.id}"
#   http_method = "${aws_api_gateway_method.options_method_user_id.http_method}"
#   status_code = "${aws_api_gateway_method_response.options_200_user_id.status_code}"

#   response_parameters = {
#     "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
#     "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'"
#     "method.response.header.Access-Control-Allow-Origin"  = "'*'"
#   }

#   depends_on = ["aws_api_gateway_method_response.options_200_user_id"]
# }

# image source
module "resource_image" {
  source = "./image"

  api_parent_id = "${aws_api_gateway_resource.userId.id}"
  rest_api_id   = "${var.rest_api_id}"
  app_region    = "${var.app_region}"
  account_id    = "${var.account_id}"
  app_name      = "${var.app_name}"
  lambda_role   = "${var.lambda_role}"

  dynamodb_table_name = "${var.dynamodb_table_name}"
}
