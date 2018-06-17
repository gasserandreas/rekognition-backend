variable "app_region" {}
variable "account_id" {}
variable "app_name" {}

# create api
resource "aws_api_gateway_rest_api" "api" {
  name = "${var.app_name}_api"
}

# resources
module "resource_user" {
  source = "./resources/user"

  api_parent_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  app_region    = "${var.app_region}"
  account_id    = "${var.account_id}"
  app_name      = "${var.app_name}"
  lambda_role   = "${aws_iam_role.lambda_role.arn}"
}

# lambda execution role
resource "aws_iam_role" "lambda_role" {
  name = "${var.app_name}_lambda_role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

# cloudwatch log group 
data "aws_iam_policy_document" "cloudwatch_log_group_lambda" {
  statement {
    actions = [
      "logs:PutLogEvents",    # take care of action order
      "logs:CreateLogStream",
      "logs:CreateLogGroup",
    ]

    resources = [
      "arn:aws:logs:*:*:*",
    ]
  }
}

# attach cloudwatch log group to lambda role
resource "aws_iam_role_policy" "lambda_cloudwatch_log_group" {
  name   = "cloudwatch-log-group"
  role   = "${aws_iam_role.lambda_role.name}"
  policy = "${data.aws_iam_policy_document.cloudwatch_log_group_lambda.json}"
}

# deploy api
resource "aws_api_gateway_deployment" "prod" {
  depends_on = [
    "module.resource_user",
  ]

  # "aws_api_gateway_integration.get_lambda_integration",
  # "aws_api_gateway_integration.post_lambda_integration",
  # "aws_api_gateway_integration.get_with_id_lambda_integration",

  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  stage_name  = "prod"
}

# output api
output "invoke_url" {
  value = "${aws_api_gateway_deployment.prod.invoke_url}"
}
