# Variables
variable "app_region" {}

variable "account_id" {}

variable "app_name" {}

# define s3 bucket
resource "aws_s3_bucket" "image_bucket" {
  bucket = "${var.account_id}-${var.app_name}-image-bucket"
  acl    = "private"

  lifecycle_rule = [
    {
      enabled = true
      id      = "retire exports after 30 days"

      noncurrent_version_expiration = [
        {
          days = 30
        },
      ]

      expiration = [
        {
          days = 30
        },
      ]
    },
  ]
}

output "bucket_arn" {
  value = "${aws_s3_bucket.image_bucket.arn}"
}

output "bucket_id" {
  value = "${aws_s3_bucket.image_bucket.id}"
}

output "bucket_name" {
  value = "${aws_s3_bucket.image_bucket.bucket}"
}
