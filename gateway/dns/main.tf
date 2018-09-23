variable "api_domain_name" {}
variable "route53_zone_id" {}
variable "certificate_arn" {}

# custom domain name
resource "aws_api_gateway_domain_name" "api_domain_name" {
  domain_name     = "${var.api_domain_name}"
  certificate_arn = "${var.certificate_arn}"
}

resource "aws_route53_record" "api_domain_name" {
  zone_id = "${var.route53_zone_id}"

  name = "${var.api_domain_name}"
  type = "A"

  alias = {
    name                   = "${aws_api_gateway_domain_name.api_domain_name.cloudfront_domain_name}"
    zone_id                = "${aws_api_gateway_domain_name.api_domain_name.cloudfront_zone_id}"
    evaluate_target_health = false
  }
}
