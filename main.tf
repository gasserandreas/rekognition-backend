# Variables
variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "hosted_zone_id" {}
variable "api_domain_name" {}
variable "api_version" {}
variable "api_stage" {}
variable "aws_certificate_arn" {}
variable "auth_app_secret" {}


# disable on local
provider "aws" {
  region = "${var.app_region}"
}

# disable on local
module "gateway" {
  source = "./gateway"

  app_region      = "${var.app_region}"
  account_id      = "${var.account_id}"
  app_name        = "${var.app_name}"
  api_domain_name = "${var.api_domain_name}"
  api_version     = "${var.api_version}"
  api_stage       = "${var.api_stage}"
  route53_zone_id = "${var.hosted_zone_id}"
  certificate_arn = "${var.aws_certificate_arn}"
  auth_app_secret = "${var.auth_app_secret}"

  dynamodb_table_names = [
    "{IMAGE:${module.dynamo_table_image.name}}",
    "{FACE:${module.dynamo_table_face.name}}",
    "{USER:${module.dynamo_table_user.name}}",
  ]
}

# disable on local
module "image-buckets" {
  source = "./image-buckets"

  app_region = "${var.app_region}"
  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
}

# # enable on loocal
# provider "aws" {
#   # alias = "local"
#   region = "${var.app_region}"
#   # shared_credentials_file = "~/.aws/credentials"
#   # profile = "private"

#   # access_key = "anaccesskey"
#   # secret_key = "asecretkey"
#   skip_credentials_validation = true
#   skip_metadata_api_check = true
#   s3_force_path_style = true
#   endpoints {
#     s3 = "http://localhost:4572",
#     dynamodb = "http://localhost:4569",
#     lambda   = "http://localhost:4574",
#     apigateway = "http://localhost:4567",
#     # "route53" = "http://localhost:4580",
#     cloudformation="http://localhost:4581",
#     cloudwatch="http://localhost:4582",
#   }
# }

module "dynamo_table_image" {
  source = "./dynamo/image"

  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
} 

module "dynamo_table_face" {
  source = "./dynamo/face"

  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
} 

module "dynamo_table_user" {
  source = "./dynamo/user"

  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
} 
