require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const port = process.env.PORT || 3000;
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const redis = require("redis")
const RedisStore = require("connect-redis").default

const config = require("./config.js");
const configDB = require("./config/database.js");
const seed = require("./config/seed.js");
// const demo = require('./config/demo.js')

async function init(req, res, next) {
  const app = express();

  require("./config/passport")(passport); // pass passport for configuration

  // extract domain regex
  const parts = config.domain.split('.');
  const firstPart = parts[0]
  const secondPart = parts.slice(1)
  const domainRegex = new RegExp(`/^https?:\/\/([\w\d]+\.)?${firstPart}\.${secondPart.join('.')}$/`);

  // TODO: using different subdomain name from instance name
  const getInstance = (subdomain) => { return Object.keys(config.instances).reduce((a, i) => (config.instances[i].subdomain === subdomain) ? i : a, undefined) }

  app.use(
    cors({
      credentials: true,
      origin: [
        "http://localhost:8888",
        "http://localhost",
        // TODO: needs testing
        `https://${process.env.SUBDOMAIN || 'ideaboard'}.${config.domain}`,
        // TODO: needs testing
        domainRegex,
        config.domain,
      ],
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      headers: [
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      ],
    })
  );

  // Instance middleware
  app.use(function (req, res, next) {
    const url = req.get("Referrer");
    let instance = "ideaboard";
    let subdomain = undefined
    if (url) {
      const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
      const domain = matches[1];
      subdomain = domain.split(".")[0];
      instance = !subdomain ? "localhost" : subdomain;
    }
    // TODO: using different subdomain name from instance name
    req.subdomain = instance;
    req.instance =
      instance.indexOf("localhost") !== -1 || (subdomain === config.domain.split('.')[0]) ? config.instances.default : getInstance(instance);


    next();
  });

  mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, serverSelectionTimeoutMS: 5000 }); // connect to our database

  // set up our express application
  app.use(morgan("dev")); // log every request to the console
  // app.use(express.json());
  app.use(bodyParser.json());
  app.use(cookieParser()); // read cookies (needed for auth)

  // Initialize client.
  let redisClient = redis.createClient({
    url: `${process.env.REDIS_URL || 'redis://redis:6379'}`
  })
  await redisClient.connect().catch(console.error)
  // Initialize store.
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "ideaboard:",
  })

  app.use(
    session({
      secret: process.env.PASSPORT_SESSION_SECRET || "not_very_secret",
      resave: false,
      saveUninitialized: false,
      store: redisStore,
      // cookie: { secure: true }
    })
  );

  // required for passport
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

  app.get("/health", (req, res) => {
    res.sendStatus(200);
  });

  app.get("/", (req, res) => {
    res.send("Ideaboard API");
  });

  require("./app/routes/auth.js")(app, passport);
  require("./app/routes/unsplash.js")(app, passport);
  require("./app/routes/upload.js")(app, passport);
  require("./app/routes/user.js")(app, passport);
  require("./app/routes/idea.js")(app, passport);
  require("./app/routes/category.js")(app, passport);
  require("./app/routes/sensor.js")(app, passport);
  require("./app/routes/sensor-type.js")(app, passport);
  require("./app/routes/loan.js")(app, passport);
  require("./app/routes/comment.js")(app, passport);
  require("./app/routes/task.js")(app, passport);
  require("./app/routes/update.js")(app, passport);
  require("./app/routes/task-response.js")(app, passport);
  require("./app/routes/invitation.js")(app, passport);
  require("./app/routes/permission.js")(app, passport);
  require("./app/routes/notification.js")(app, passport);
  require("./app/routes/document.js")(app, passport);
  require("./app/routes/moderate.js")(app, passport);


  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });

}

init();