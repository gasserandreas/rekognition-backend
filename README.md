# Backend for AWS Rekognition

Used AWS services:
- AWS Gateway: API backend resource
- DNS: Use external DNS / HTTPS configuration
- S3 Buckets: Define thumb and image file
- Dynamo: Database

## Getting started

### Installation
This packages uses following external development dependencies:
- localstack
- node8 & npm 6
- git
- Terraform
- VisualStudio Code

1. Make sure external development dependencies are installed (see above)
2. Clone this repo if not yet done
3. Setup AWS credentials account by using profiled accounts: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
4. Add profiled account to `main.tf`
```javascript
shared_credentials_file = "~/.aws/credentials"
profile = "aws-rekognition-backend"
```
5. Setup terraform workspaces for `local, dev, test` by using the `terraform workspace create {worskpace-name}` command (replace workspace-name with local, dev or test).
6. Setup terraform.env files for each environment (naming schema: terraform.{your-environemnt-name}.tfvars) by clone / rename the `terraform.environment.example.tfvars` file. Note: All empty settings must be set in your used environment files.
7. Init terraform by calling: `terraform init`.
8. Apply dev environment on AWS by calling `npm run apply-dev`.
9. As soon as dev enrionment is loaded, open newly created lambda function in AWS web console and navigate down to environment section.
10. In graphql-server, copy `.env.example` to `.env` and copy / paste content from `DYNAMODB_TABLE_NAMES` and `S3_BUCKET_NAMES` from AWS console into `.env` file.
11. Add AWS user credentials to `.env`. Make sure you credentials are allowed to use `S3` and `Rekognition`.
12. Cd into `graphql-server` and install dependencies: `npm install` as your last step. 

### Start development
1. Open whole project in Visual Studio Code.
2. Open `main.tf` and comment out all "disable on local" flagged modules and enable "enable on local" modules instead.
3. Start localstack: `localstack start`
4. Apply environment locally by calling: `npm run apply-local`.
5. Init basic user with `. init-localstack.sh`.
6. Start graphql server (in case of issue at first start, restart build process again): `npm start`
7. Open `localhost:4000` to load GraphQL playground
8. Change any file and server will reload with `nodemon`.

## Deployment

Deployment is only supported by using Terraform. Please use multiple terraform workspaces for each AWS environment (during installation three default environments are pre-installed / supported). Due dependencies between `sharp js` and your used OS, this project must be builded by using the appropriate AWS Dockerfile image.

Before release, make sure you're not exposing any credentials and replace choose a valid "APP_SECRET" for your JWT token in the `.env` file.

1. In `main.tf` make sure all "disabled on local" modules are enabled and all "enable on local" modules are disabled.
2. Check if Terraform is init correctly by calling: `terraform init`.
3. Stop local graphql-server development process, if running.
4. Ensure Docker is installed and Docker process is running.
5. Cd into root directory and start deployment build process by executing: `make all`.
6. After build process is finished (may take a while), deploy to your target environment: `npm run apply-{enviroment}` (replace environment with your target).