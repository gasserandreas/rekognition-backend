variable "root_domain_name" {}

variable "www_domain_name" {}

variable "api_domain_name" {}

variable "validation_method" {
  default = "EMAIL"
}

resource "aws_acm_certificate" "hosting_certificate" {
  // We want a wildcard cert so we can host subdomains later.
  domain_name       = "${var.root_domain_name}"
  validation_method = "${var.validation_method}"

  // We also want the cert to be valid for the root domain even though we'll be
  // redirecting to the www. domain immediately.
  subject_alternative_names = ["${var.www_domain_name}"]
}

resource "aws_acm_certificate" "api_certificate" {
  // We want a wildcard cert so we can host subdomains later.
  domain_name       = "${var.api_domain_name}"
  validation_method = "${var.validation_method}"

  // We also want the cert to be valid for the root domain even though we'll be
  // redirecting to the www. domain immediately.
  # subject_alternative_names = ["${var.www_domain_name}"]
}

output "arn_hosting" {
  value = "${aws_acm_certificate.hosting_certificate.arn}"
}

output "arn_api" {
  value = "${aws_acm_certificate.api_certificate.arn}"
}
