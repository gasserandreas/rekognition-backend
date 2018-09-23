# Variables
variable "app_region" {}
variable "account_id" {}
variable "app_name" {}
variable "hosted_zone_id" {}
variable "api_domain_name" {}
variable "api_version" {}

# provider
provider "aws" {
  region = "${var.app_region}"
}

module "certificate" {
  source           = "./acm-certificate"
  api_domain_name  = "${var.api_domain_name}"
}

module "gateway" {
  source = "./gateway"

  app_region      = "${var.app_region}"
  account_id      = "${var.account_id}"
  app_name        = "${var.app_name}"
  api_domain_name = "${var.api_domain_name}"
  api_version     = "${var.api_version}"
  route53_zone_id = "${var.hosted_zone_id}"
  certificate_arn = "${module.certificate.arn_api}"

  dynamodb_table_name = "${module.dynamodb.table_name}"
}

module "image-buckets" {
  source = "./image-buckets"

  app_region = "${var.app_region}"
  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
}

module "dynamodb" {
  source = "./dynamo"

  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
}
