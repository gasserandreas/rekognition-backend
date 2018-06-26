variable "app_name" {}
variable "app_region" {}
variable "account_id" {}
variable "lambda_role" {}
variable "source_bucket_name" {}
variable "target_bucket_name" {}

resource "aws_lambda_function" "s3_transfer_function" {
  filename         = "./image-buckets/lambdas/image-to-thumb/image-to-thumb.zip"
  function_name    = "${var.app_name}_s3_image_create"
  role             = "${var.lambda_role}"
  handler          = "index.handler"
  runtime          = "nodejs8.10"
  source_code_hash = "${base64sha256(file("./image-buckets/lambdas/image-to-thumb/image-to-thumb.zip"))}"
  timeout          = 10

  # define lambda env vars
  environment {
    variables {
      TARGET_BUCKET = "${var.target_bucket_name}"
    }
  }
}

output "arn" {
  value = "${aws_lambda_function.s3_transfer_function.arn}"
}
