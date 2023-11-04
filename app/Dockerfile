# Start with a node 18 image with package info
# Installs *all* npm packages and runs build script
FROM node:18.12.1-alpine as build-stage
WORKDIR /app
COPY ["package*.json", "/app/"]
RUN npm ci &> /dev/null
COPY [ ".", "/app/" ]

# COPY arguments to build time env
ARG API_ADDRESS
ENV API_ADDRESS $API_ADDRESS
ARG DEPLOYMENT
ENV DEPLOYMENT $DEPLOYMENT
ARG FB_AUTH_ENABLED
ENV FB_AUTH_ENABLED $FB_AUTH_ENABLED
ARG INSTITUTION
ENV INSTITUTION $INSTITUTION
ARG CONTENT
ENV CONTENT $CONTENT
ARG APP_NAME
ENV APP_NAME $APP_NAME
ARG GTAG
ENV GTAG $GTAG

RUN npm run build

# # startup and copy the sources
FROM nginx:stable-alpine as production-stage
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf         
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]