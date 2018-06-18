variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "api_domain_name" {}
variable "api_version" {}
variable "route53_zone_id" {}
variable "certificate_arn" {}

# create api
resource "aws_api_gateway_rest_api" "api" {
  name = "${var.app_name}_api"
}

# dns api entry
module "name" {
  source = "./dns"

  api_domain_name = "${var.api_domain_name}"
  route53_zone_id = "${var.route53_zone_id}"
  certificate_arn = "${var.certificate_arn}"
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

  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  stage_name  = "prod"
}

# base mapping
resource "aws_api_gateway_base_path_mapping" "prod" {
  api_id      = "${aws_api_gateway_rest_api.api.id}"
  stage_name  = "${aws_api_gateway_deployment.prod.stage_name}"
  domain_name = "${var.api_domain_name}"
  base_path   = "${var.api_version}"
}

# output api
output "invoke_url" {
  value = "${aws_api_gateway_deployment.prod.invoke_url}"
}
