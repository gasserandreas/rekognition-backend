.PHONY: all image prepare package dist clean

all: build prepare package dist

image: 
	docker build --tag amazonlinux:nodejs .

build: 
	cd graphql-server && rm -rf node_modules package-lock.json dist/ && npm install && npm run build

prepare:
	cp graphql-server/package-lambda.json graphql-server/dist/lambda/package.json

package: image
	docker run --rm --volume ${PWD}/graphql-server/dist/lambda:/build amazonlinux:nodejs bash -c "yum install -y make && npm install"

dist:
	cd graphql-server/dist/lambda && zip -r ../../dist.zip ./
