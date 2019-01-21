.PHONY: all image prepare package dist clean

all: build prepare package

image: 
	docker build --tag amazonlinux:nodejs .

build: 
	cd graphql-server && rm -rf node_modules package-lock.json dist/ && npm install && npm run build

prepare:
	cp graphql-server/package-lambda.json graphql-server/dist/lambda/package.json

package: image
	docker run --rm --volume ${PWD}/graphql-server/dist/lambda:/build amazonlinux:nodejs bash -c "yum install -y make && npm install"

# dist: package
# 	cp -r graphql-server/node_modules graphql-server/dist/lambda

# prepare:
# 	rm -rf graphql-server/node_modules && rm graphql-server/package-lock.json

# package: image
# 	docker run --rm --volume ${PWD}/graphql-server:/build amazonlinux:nodejs bash -c "yum install -y make && npm install && npm run build"

# dist: package
# 	cp -r graphql-server/node_modules graphql-server/dist/lambda




# dist: package
# 	cd lambda && zip -FS -q -r ../dist/function.zip *

# clean:
# 	rm -r lambda/node_modules
# 	docker rmi --force amazonlinux:nodejs