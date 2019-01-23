variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "api_domain_name" {}
variable "api_version" {}
variable "api_stage" {}
variable "route53_zone_id" {}
variable "certificate_arn" {}
variable "dynamodb_table_names" {
  type        = "list"
}
variable "s3_bucket_names" {
  type        = "list"
}
variable "auth_app_secret" {}

variable "image_bucket_iam_policy_json" {}

variable "thumb_bucket_iam_policy_json" {}

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
module "resource_graphql" {
  source = "./resources/graphql"

  api_parent_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  app_region    = "${var.app_region}"
  account_id    = "${var.account_id}"
  app_name      = "${var.app_name}"
  lambda_role   = "${aws_iam_role.lambda_role.arn}"

  dynamodb_table_names = "${var.dynamodb_table_names}"
  s3_bucket_names = "${var.s3_bucket_names}"
  auth_app_secret = "${var.auth_app_secret}"
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
  name   = "${var.app_name}_cloudwatch-log-group"
  role   = "${aws_iam_role.lambda_role.name}"
  policy = "${data.aws_iam_policy_document.cloudwatch_log_group_lambda.json}"
}

# dynamo access log group
data "aws_iam_policy_document" "dynamo_access" {
  statement {
    actions = [
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
    ]

    resources = [
      "arn:aws:dynamodb:*:*:*",
    ]
  }
}

# attach dynamo access to lambda role
resource "aws_iam_role_policy" "dynamo_log_group_policy" {
  name   = "${var.app_name}_dynamo-log-group"
  role   = "${aws_iam_role.lambda_role.name}"
  policy = "${data.aws_iam_policy_document.dynamo_access.json}"
}

# attach rekognition access to lambda role
resource "aws_iam_role_policy_attachment" "lambda_rekognition_full_access_attach" {
  role   = "${aws_iam_role.lambda_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonRekognitionFullAccess"
}

# S3 buckets access

# attach s3 policy to role for bucket: bucket-a
resource "aws_iam_role_policy" "lambda_s3_access_thumb_bucket" {
  name   = "${var.app_name}_lambda_s3_bucket_access_thumb_bucket"
  role   = "${aws_iam_role.lambda_role.name}"
  # role   = "${aws_iam_role.iam_for_lambda.name}"
  policy = "${var.thumb_bucket_iam_policy_json}"
}

resource "aws_iam_role_policy" "lambda_s3_access_image_bucket" {
  name   = "${var.app_name}_lambda_s3_bucket_access_image_bucket"
  role   = "${aws_iam_role.lambda_role.name}"
  # role   = "${aws_iam_role.iam_for_lambda.name}"
  policy = "${var.image_bucket_iam_policy_json}"
}

# deploy api
resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    "module.resource_graphql",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  stage_name  = "${var.api_stage}"
}

# base mapping
resource "aws_api_gateway_base_path_mapping" "path_mapping" {
  api_id      = "${aws_api_gateway_rest_api.api.id}"
  stage_name  = "${aws_api_gateway_deployment.deployment.stage_name}"
  domain_name = "${var.api_domain_name}"
  base_path   = "${var.api_version}"
}

# output api
output "invoke_url" {
  value = "${aws_api_gateway_deployment.deployment.invoke_url}"
}

output "graphql_lambda_role_name" {
  value = "${aws_iam_role.lambda_role.name}"
}
