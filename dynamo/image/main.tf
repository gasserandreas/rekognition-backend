variable "account_id" {}
variable "app_name" {}

resource "aws_dynamodb_table" "dynamo_simple_table" {
  name           = "${var.account_id}-${var.app_name}-image"
  read_capacity  = 2
  write_capacity = 1
  hash_key = "user_id"
  range_key = "id"

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

  # global_secondary_index {
  #   name               = "image-user-id"
  #   hash_key           = "user_id"
  #   write_capacity     = 5
  #   read_capacity      = 5
  #   projection_type    = "INCLUDE"
  #   non_key_attributes = ["user_id"]
  # }
}

output "arn" {
  value = "${aws_dynamodb_table.dynamo_simple_table.arn}"
}

output "name" {
  value = "${aws_dynamodb_table.dynamo_simple_table.name}"
}
