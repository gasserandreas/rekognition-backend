FROM amazonlinux

# ADD etc/nodesource.gpg.key /etc
ADD etc/nodesource.gpg.key /etc

WORKDIR /tmp

# RUN yum -y install gcc-c++ && \
#     rpm --import /etc/nodesource.gpg.key && \
#     curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash - && \
#     sudo apt-get install -y nodejs \
#     npm install -g npm@latest && \
#     npm cache clean --force && \
#     yum clean all && \

RUN yum -y install gcc-c++ && \
    rpm --import /etc/nodesource.gpg.key && \
    curl --location --output ns.rpm https://rpm.nodesource.com/pub_8.x/el/7/x86_64/nodejs-8.4.0-1nodesource.el7.centos.x86_64.rpm && \
    rpm --checksig ns.rpm && \
    rpm --install --force ns.rpm && \
    npm install -g npm@latest && \
    npm cache clean --force && \
    yum clean all && \
    rm --force ns.rpm

WORKDIR /build

# FROM node:8

# # add graphql context
# ADD ./graphql-server ./graphql-server

# # changed over to context
# WORKDIR ./graphql-server

# # delete node_module
# RUN rm -rf node_modules dist

# # # install node modules 
# RUN npm install

# # # build stuff
# RUN npm run build

# CMD ["sh", "-c", "cp -r ./dist/lambda ../graphql-lambda/ && ls -a ../graphql-lambda"]
