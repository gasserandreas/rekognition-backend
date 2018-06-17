variable "root_domain_name" {}

variable "www_domain_name" {}

variable "distribution_domain_name" {}

variable "distribution_hosted_zone_id" {}

variable "route53_zone_id" {}

resource "aws_route53_record" "www" {
  zone_id = "${var.route53_zone_id}"

  name = "${var.root_domain_name}"
  type = "A"

  alias = {
    name                   = "${var.distribution_domain_name}"
    zone_id                = "${var.distribution_hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_root" {
  zone_id = "${var.route53_zone_id}"

  name = "${var.www_domain_name}"
  type = "CNAME"
  ttl  = "900"

  records = ["${var.root_domain_name}"]
}
