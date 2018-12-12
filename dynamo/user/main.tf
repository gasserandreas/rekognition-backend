variable "account_id" {}
variable "app_name" {}

resource "aws_dynamodb_table" "dynamo_simple_table" {
  name           = "${var.account_id}-${var.app_name}-user"
  read_capacity  = 2
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }

  global_secondary_index {
    name               = "user_email"
    hash_key           = "email"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "INCLUDE"
    non_key_attributes = ["email"]
  }
}

output "arn" {
  value = "${aws_dynamodb_table.dynamo_simple_table.arn}"
}

output "name" {
  value = "${aws_dynamodb_table.dynamo_simple_table.name}"
}