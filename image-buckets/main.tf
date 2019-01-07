variable "app_region" {}
variable "account_id" {}
variable "app_name" {}

# s3 bucket a
module "image_bucket" {
  source = "./buckets/image-bucket"

  app_region = "${var.app_region}"
  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
}

# s3 bucket b
module "thumb_bucket" {
  source = "./buckets/thumb-bucket"

  app_region = "${var.app_region}"
  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
}

# IAM role for aws
# resource "aws_iam_role" "iam_for_lambda" {
#   name = "${var.app_name}_iam_for_lambda"

#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": "sts:AssumeRole",
#       "Principal": {
#         "Service": "lambda.amazonaws.com"
#       },
#       "Effect": "Allow"
#     }
#   ]
# }
# EOF
# }

# cloudwatch log group 
# data "aws_iam_policy_document" "cloudwatch_log_group_lambda" {
#   statement {
#     actions = [
#       "logs:PutLogEvents",    # take care of action order
#       "logs:CreateLogStream",
#       "logs:CreateLogGroup",
#     ]

#     resources = [
#       "arn:aws:logs:*:*:*",
#     ]
#   }
# }

# attach cloudwatch log group to lambda role
# resource "aws_iam_role_policy" "transfer_lambda_cloudwatch_log_group" {
#   name   = "${var.app_name}_cloudwatch-log-group"
#   role   = "${aws_iam_role.iam_for_lambda.name}"
#   policy = "${data.aws_iam_policy_document.cloudwatch_log_group_lambda.json}"
# }




# access policy for s3 bucket: image-bucket
data "aws_iam_policy_document" "s3_acccess_image_bucket" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]

    resources = [
      "${module.image_bucket.bucket_arn}/*", # don't forget /* after bucket
    ]
  }
}

# attach s3 policy to role for bucket: image-bucket
# resource "aws_iam_role_policy" "lambda_s3_access_image_bucket" {
#   name   = "${var.app_name}_lambda_s3_image_bucket_access_thumb_bucket"
#   role   = "${var.graphql_lambda_iam_name}"
#   policy = "${data.aws_iam_policy_document.s3_acccess_image_bucket.json}"
# }

# access policy for s3 bucket: bucket-b
data "aws_iam_policy_document" "s3_acccess_thumb_bucket" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]

    resources = [
      "${module.thumb_bucket.bucket_arn}/*", # don't forget /* after bucket
    ]
  }
}

output "image_bucket_iam_policy_json" {
  value = "${data.aws_iam_policy_document.s3_acccess_image_bucket.json}"
}

output "image_bucket_name" {
  value = "${module.image_bucket.bucket_name}"
}

output "thumbs_bucket_iam_policy_json" {
  value = "${data.aws_iam_policy_document.s3_acccess_thumb_bucket.json}"
}

output "thumb_bucket_name" {
  value = "${module.thumb_bucket.bucket_name}"
}

# attach s3 policy to role for bucket: bucket-a
# resource "aws_iam_role_policy" "lambda_s3_access_thumb_bucket" {
#   name   = "${var.app_name}_lambda_s3_bucket_access_thumb_bucket"
#   role   = "${var.graphql_lambda_iam_name}"
#   # role   = "${aws_iam_role.iam_for_lambda.name}"
#   policy = "${data.aws_iam_policy_document.s3_acccess_thumb_bucket.json}"
# }



# # lambda permisson for s3
# resource "aws_lambda_permission" "allow_bucket" {
#   statement_id  = "AllowExecutionFromS3Bucket"
#   action        = "lambda:InvokeFunction"
#   function_name = "${module.s3_create_lambda_func.arn}"
#   principal     = "s3.amazonaws.com"
#   source_arn    = "${module.image_bucket.bucket_arn}"
# }

# # bucket notification specification
# resource "aws_s3_bucket_notification" "bucket_notification" {
#   bucket = "${module.image_bucket.bucket_id}"

#   lambda_function {
#     lambda_function_arn = "${module.s3_create_lambda_func.arn}"
#     events              = ["s3:ObjectCreated:*"]
#     filter_prefix       = ""
#     filter_suffix       = ""
#   }
# }

# define labmda
# module "s3_create_lambda_func" {
#   source = "./lambdas/image-to-thumb"

#   app_name           = "${var.app_name}"
#   app_region         = "${var.app_region}"
#   account_id         = "${var.account_id}"
#   lambda_role        = "${aws_iam_role.iam_for_lambda.arn}"
#   source_bucket_name = "${module.image_bucket.bucket_name}"
#   target_bucket_name = "${module.thumb_bucket.bucket_name}"
# }
