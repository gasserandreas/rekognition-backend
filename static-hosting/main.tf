# Variables
variable "app_region" {}

variable "account_id" {}

variable "app_name" {}

variable "www_domain_name" {}

variable "root_domain_name" {}

variable "hosted_zone_id" {}

variable "certificate_arn" {}

module "s3_bucket_static_hosting" {
  source = "./s3"

  app_region       = "${var.app_region}"
  account_id       = "${var.account_id}"
  app_name         = "${var.app_name}"
  root_domain_name = "${var.root_domain_name}"
}

module "cloudfront" {
  source                     = "./cloudfront"
  root_domain_name           = "${var.root_domain_name}"
  www_domain_name            = "${var.www_domain_name}"
  s3_bucket_website_endpoint = "${module.s3_bucket_static_hosting.website_endpoint}"
  acm_certification_arn      = "${var.certificate_arn}"
}

module "dns" {
  source                      = "./dns"
  www_domain_name             = "${var.www_domain_name}"
  root_domain_name            = "${var.root_domain_name}"
  distribution_domain_name    = "${module.cloudfront.distribution_domain_name}"
  distribution_hosted_zone_id = "${module.cloudfront.distribution_hosted_zone_id}"

  # use new created zone
  # route53_zone_id = "${aws_route53_zone.zone.id}"

  # use existing zone
  route53_zone_id = "${var.hosted_zone_id}"
}
