variable "api_parent_id" {}
variable "rest_api_id" {}
variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "lambda_role" {}

# user resources for get (list), post, put and delete
resource "aws_api_gateway_resource" "user" {
  path_part   = "user"
  parent_id   = "${var.api_parent_id}"
  rest_api_id = "${var.rest_api_id}"
}

# user get resource with id only
resource "aws_api_gateway_resource" "userId" {
  path_part   = "{userId}"
  parent_id   = "${aws_api_gateway_resource.user.id}"
  rest_api_id = "${var.rest_api_id}"
}

# image source
module "resource_image" {
  source = "./image"

  api_parent_id = "${aws_api_gateway_resource.userId.id}"
  rest_api_id   = "${var.rest_api_id}"
  app_region    = "${var.app_region}"
  account_id    = "${var.account_id}"
  app_name      = "${var.app_name}"
  lambda_role   = "${var.lambda_role}"
}

# output "get_lambda_integration" {
#   value = "${module.resource_image.get_lambda_integration}"
# }

