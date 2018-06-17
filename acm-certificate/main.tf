variable "root_domain_name" {}

variable "validation_method" {
  default = "EMAIL"
}

resource "aws_acm_certificate" "certificate" {
  // We want a wildcard cert so we can host subdomains later.
  domain_name       = "*.${var.root_domain_name}"
  validation_method = "${var.validation_method}"

  // We also want the cert to be valid for the root domain even though we'll be
  // redirecting to the www. domain immediately.
  subject_alternative_names = ["${var.root_domain_name}"]
}

output "arn" {
  value = "${aws_acm_certificate.certificate.arn}"
}
