variable "account_id" {}
variable "app_name" {}

resource "aws_dynamodb_table" "dynamo_simple_table" {
  name           = "${var.account_id}-${var.app_name}-face"
  read_capacity  = 10
  write_capacity = 10
  hash_key = "image_id"
  range_key = "id"

  attribute {
    name = "image_id"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }

  # global_secondary_index {
  #   name               = "face-user-id"
  #   hash_key           = "user_id"
  #   write_capacity     = 5
  #   read_capacity      = 5
  #   projection_type    = "INCLUDE"
  #   non_key_attributes = ["user_id"]
  # }

  # global_secondary_index {
  #   name               = "face-image-id"
  #   hash_key           = "user_id"
  #   range_key          = "image_id"
  #   write_capacity     = 5
  #   read_capacity      = 5
  #   projection_type    = "INCLUDE"
  #   non_key_attributes = ["user_id"]
  # }
}

output "arn" {
  value = "${aws_dynamodb_table.dynamo_simple_table.arn}"
}

output "table_name" {
  value = "${aws_dynamodb_table.dynamo_simple_table.name}"
}
