variable "app_name" {}
variable "app_region" {}
variable "account_id" {}
variable "lambda_role" {}
variable "api" {}
variable "gateway_method" {}
variable "gateway_name" {}
variable "resource_path" {}
variable "dynamodb_table_name" {}

resource "aws_lambda_function" "get_lambda" {
  filename         = "./gateway/resources/user/image/get/get.zip"
  function_name    = "${var.app_name}_${var.gateway_name}_get"
  role             = "${var.lambda_role}"
  handler          = "index.handler"
  runtime          = "nodejs6.10"
  source_code_hash = "${base64sha256(file("./gateway/resources/user/image/get/get.zip"))}"

  # define lambda env vars
  environment {
    variables {
      DYNAMODB_TABLE_NAME = "${var.dynamodb_table_name}"
    }
  }
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.get_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.app_region}:${var.account_id}:${var.api}/*/${var.gateway_method}${var.resource_path}"
}

output "arn" {
  value = "${aws_lambda_function.get_lambda.arn}"
}
