# Variables
variable "app_region" {}

variable "account_id" {}

variable "app_name" {}

# define s3 bucket
resource "aws_s3_bucket" "thumb_bucket" {
  bucket = "${var.account_id}-${var.app_name}-thumb-bucket"
  acl    = "private"

  lifecycle_rule = [
    {
      enabled = true
      id      = "retire exports after 180 days"

      noncurrent_version_expiration = [
        {
          days = 180
        },
      ]

      expiration = [
        {
          days = 180
        },
      ]
    },
  ]

  cors_rule = {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "DELETE"]
    allowed_origins = ["*", "http://*", "https://*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  # allow public access for this bucket
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::${var.account_id}-${var.app_name}-thumb-bucket/*"]
    },
    {
      "Sid": "AddWritePerm",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::${var.account_id}:user/aws-rekognition-frontend"
      },
      "Action": [
        "s3:DeleteObject",
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource":["arn:aws:s3:::${var.account_id}-${var.app_name}-thumb-bucket/*"]
    }
  ]
}
POLICY
}

output "bucket_arn" {
  value = "${aws_s3_bucket.thumb_bucket.arn}"
}

output "bucket_id" {
  value = "${aws_s3_bucket.thumb_bucket.id}"
}

output "bucket_name" {
  value = "${aws_s3_bucket.thumb_bucket.bucket}"
}
