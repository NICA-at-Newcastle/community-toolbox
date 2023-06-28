# Ideaboard

> Ideaboard is an online tool for having rich discussions around a topic. It can be used for an extensive range of activities such as designing products, organising events or gathering feedback from customers.

> Developed at Open Lab, Newcastle University as an open-source project to support new and upcoming research projects.

## Contributors
| Name | Contribution | Contact |
| --- | --- | --- |
| `Edward Jenkins` | `Original Creator` | [edjenkins.co.uk](https://edjenkins.co.uk), [@edjenkins91](https://twitter.com/edjenkins91)|
| `Aare Puussaar` | `Contributor` | [github.com/aarepuu](https://github.com/aarepuu), [@aarewoodisland](https://twitter.com/aarewoodisland)|

## Repository Structure

**Caddyfile** - contains the configuration for Caddy Server (subdomains for various instances) for deploying with Caddy.

**docker-compose-caddy.yml** - contains the docker configuration for the app, api, mongo, redis and other services for Caddy deployment.

**docker-compose-dev.yml** - contains the docker configuration for the app, api, mongo, redis and other services for local development deployment.

**docker-compose-dev.yml** - contains the docker configuration for the app, api, mongo, redis and other services for Traefik deployment.


### /api
Directory containing the back end for the system, this is a node application consisting of an [Express.js](https://expressjs.com) server.

### /app
A standalone [Vue.js](http://vuejs.org) frontend which integrates with the back end.

### /init
Docker initialisation files. Includes a [MongoDB](https://www.mongodb.com) script which can be used to set the user password.

### /utilities
Contains a backup script for dumping the contents of the [MongoDB](https://www.mongodb.com) and uploading to an [AWS S3](https://aws.amazon.com/s3) bucket.

## Features

### Ideas
An idea consists of the several properties; Title, tagline, description and image. These are used to portray a high level idea, task or aim which users can work towards solving using the available tools. Ideas can be created by anyone and can belong to a category to aid sorting.

### Design
Users can create ideas which are then collaboratively designed in a workspace. There are several modules available in the workspace including the following:
- Chat
- Media
- Poll
- Rich text
- Video call
- Whiteboard
- Record video

### Outcome
Once an idea has been designed it, users can perform a series of actions from the outcome panel. These include the following:
- Create a rich outcome document summarising the idea
- Link the idea to a new idea, thus continuing the design process

## Deployments
| Name | Description | Link |
| --- | --- | --- |
| ~~`Main`~~ | ~~`The public version of the site which can be used to develop any idea.`~~ | ~~[ideaboard.co.uk](https://ideaboard.co.uk)~~|
| ~~`Myto`~~ | ~~`A collaborative design experiment working with experts to develop ideas around mitochondrial disease.`~~ | ~~[myto.ideaboard.co.uk](https://myto.ideaboard.co.uk)~~|
| `SenseMyStreet` | `Proposals and ideas generation system for SenseMyStreet community sensor commissioning toolkit` | [https://ideaboard.sensemystreet.co.uk](https://ideaboard.sensemystreet.co.uk)|


## Details
- Vue.js frontend which communicates with a vanilla Express node.js server.
  - node.js - [nodejs.org](https://nodejs.org)
  - Vue.js - [vuejs.org](https://vuejs.org)
  - Express - [expressjs.com](https://expressjs.com)
- Webpack is used to build front-end
  - Webpack - [webpack.js.org](https://webpack.js.org/)
- Redis for session support.
  - Redis - [redis.io](https://redis.io/)
- Caddy server for automatic SSL and domain configuration.
  - Caddy - [caddyserver.com](https://caddyserver.com/)
- Traefik reverse proxy for SSL and domain configuration.
  - Traefik - [traefik.io](https://traefik.io)
  - Reverse-proxy [reverse-proxy](https://github.com/aarepuu/reverse-proxy)
- AWS Elastic Transcoder for remote video encoding and thumbnail generation.
  - AWS Elastic Transcoder - [aws.amazon.com/elastictranscoder](https://aws.amazon.com/elastictranscoder)
- AWS S3 for storage of media and other user-generated content.
  - AWS S3 - [aws.amazon.com/s3](https://aws.amazon.com/s3)


## Getting started

### Start by pulling this repository and creating the required .env to store private keys/passwords/secrets (use the examples provided).
```
cp ./example.env ./.env
cp ./api/example.env ./api/.env
```

### Install node dependencies from [npmjs.com](https://www.npmjs.com/) for client and server.
```
cd app && npm install
cd ..
cd api && npm install
```

### Spin up the docker stack. This will fire up the API, redis, mongo and some helper containers.
```
docker-compose -f docker-compose-dev.yml up -d --build
```

## Monitor the containers
```
docker-compose logs -f [CONTAINER_NAME]
```

## Start webpack to serve development files
``` bash
# Move into app directory
cd app

# Serve app with hot reload enabled (localhost:8080)
npm run dev
```

## Deployment

Ideaboard can be deployed using either [Caddy Server](https://caddyserver.com/) or Traefik[reverse-proxy](https://github.com/aarepuu/reverse-proxy)

### Using Caddy:

Run:

```
docker-compose -f docker-compose-caddy.yml up -d --build
```

### Using Traefik:

Make sure you have set up and deployed Traefik [reverse-proxy](https://github.com/aarepuu/reverse-proxy) first on your machine. Then run:

```
docker-compose up -d --build
```

>NOTE!: Traefik enables you to also run the app on a particular subdomain. For that you need to use the `SUBDOMAIN` variable in addition to the `DEPLOYMENT` variable in the `.env` file.


## Adding an instance
Ideaboard supports multiple subdomains/instances. New instances can be added quite easily. The backend serves content based on the domain of each request for simplicity.

There are several steps to adding a new instance:

- Add a homepage component to the instances directory - `/app/src/components/instances/example.vue`.

- Add configuration for instance - `app/src/config.js`.

- [Optional] - add seed configuration for instance - `api/config.js`.

- Update the `Caddyfile` with the new subdomain (only when using Caddy)

## Contributing
Please feel free to pull the code and add to it where you see fit. If you do anything interesting tweet me [@edjenkins91](https://twitter.com/edjenkins91)