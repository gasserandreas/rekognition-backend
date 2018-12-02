variable "account_id" {}
variable "app_name" {}

resource "aws_dynamodb_table" "dynamo_simple_table" {
  name           = "${var.account_id}-${var.app_name}-user"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

output "arn" {
  value = "${aws_dynamodb_table.dynamo_simple_table.arn}"
}

output "name" {
  value = "${aws_dynamodb_table.dynamo_simple_table.name}"
}