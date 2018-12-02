variable "account_id" {}
variable "app_name" {}

resource "aws_dynamodb_table" "dynamo_simple_table" {
  name           = "${var.account_id}-${var.app_name}-image"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "id"
  range_key      = "user_id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "user_id"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }

  global_secondary_index {
    name               = "image-user-id"
    hash_key           = "user_id"
    write_capacity     = 5
    read_capacity      = 5
    projection_type    = "INCLUDE"
    non_key_attributes = ["user_id"]
  }
}

output "arn" {
  value = "${aws_dynamodb_table.dynamo_simple_table.arn}"
}

output "table_name" {
  value = "${aws_dynamodb_table.dynamo_simple_table.name}"
}
