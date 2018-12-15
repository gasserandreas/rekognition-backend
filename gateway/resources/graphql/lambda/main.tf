variable "app_name" {}
variable "app_region" {}
variable "account_id" {}
variable "lambda_role" {}
variable "api" {}
variable "gateway_method" {}
variable "gateway_name" {}
variable "resource_path" {}
variable "dynamodb_table_names" {
  type        = "list"
}
variable "auth_app_secret" {}

resource "aws_lambda_function" "post_lambda" {
  filename         = "./graphql-server/dist.zip"
  function_name    = "${var.app_name}_${var.gateway_name}_graphql"
  role             = "${var.lambda_role}"
  handler          = "index.graphql"
  runtime          = "nodejs8.10"
  source_code_hash = "${base64sha256(file("./graphql-server/dist.zip"))}"
  memory_size = 512
  timeout = "10"

  environment {
    variables {
      DYNAMODB_TABLE_NAMES = "${jsonencode(var.dynamodb_table_names)}"
      APP_SECRET = "${var.auth_app_secret}"
    }
  }
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.post_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.app_region}:${var.account_id}:${var.api}/*/${var.gateway_method}${var.resource_path}"
}

output "arn" {
  value = "${aws_lambda_function.post_lambda.arn}"
}
