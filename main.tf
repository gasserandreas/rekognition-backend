# Variables
variable "app_region" {}

variable "account_id" {}

variable "app_name" {}

variable "www_domain_name" {}

variable "root_domain_name" {}

variable "hosted_zone_id" {}

variable "api_domain_name" {}

# provider
provider "aws" {
  region = "${var.app_region}"
}

module "certificate" {
  source           = "./acm-certificate"
  root_domain_name = "${var.root_domain_name}"
}

module "static-hosting" {
  source = "./static-hosting"

  certificate_arn  = "${module.certificate.arn}"
  app_region       = "${var.app_region}"
  account_id       = "${var.account_id}"
  app_name         = "${var.app_name}"
  www_domain_name  = "${var.www_domain_name}"
  root_domain_name = "${var.root_domain_name}"
  hosted_zone_id   = "${var.hosted_zone_id}"
}

# 
module "gateway" {
  source = "./gateway"

  app_region = "${var.app_region}"
  account_id = "${var.account_id}"
  app_name   = "${var.app_name}"
}
