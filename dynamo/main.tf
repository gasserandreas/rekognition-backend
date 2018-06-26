variable "account_id" {}
variable "app_name" {}

resource "aws_dynamodb_table" "image_table" {
  name           = "${var.account_id}-${var.app_name}-images"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "userId"
  range_key      = "imageId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "imageId"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }

  # global_secondary_index {
  #   name            = "UserIdIndex"
  #   hash_key        = "UserId"
  #   range_key       = "UserIds"
  #   write_capacity  = 10
  #   read_capacity   = 10
  #   projection_type = "INCLUDE"
  # }

  tags {
    Name        = "dynamodb-table-1"
    Environment = "production"
  }
}

output "arn" {
  value = "${aws_dynamodb_table.image_table.arn}"
}

output "table_name" {
  value = "${aws_dynamodb_table.image_table.name}"
}
