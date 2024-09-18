// const express = require("express");
// const app = express();
// require("dotenv").config();
// const ENV = process.env;

// const configStaticResource = require("./config/configStaticResource");
// const configSession = require("./config/configSession");
// const { NotFound, HandleError } = require("./middlewares/ErrorHandling");
// const passport = require("./config/mainPassport");
// const bodyParser = require("body-parser");
// const flash = require("express-flash");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const sslServer = require("./config/configSSL");

// // Config
// app.use(express.urlencoded({ extended: true }));
// configStaticResource(app, path.join(__dirname, "public"));
// configSession(app);
// app.use(bodyParser.json());
// app.use(flash());
// app.use(cors({ credentials: true, origin: true }));
// app.use(cookieParser("sgx"));

// //No Caching
// // app.use((req, res, next) => {
// //     res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
// //     next();
// // });

// //No authentication
// app.use(passport.initialize());
// app.use(passport.session());

// //Router
// app.use("/api", require("./routers/api.r"));

// //Handle error middleware
// app.use(NotFound);
// app.use(HandleError);

// const appSSL = sslServer(app);

// appSSL.listen(ENV.WEBPORT);

const path = require("path");
const configEV = require("./config/configEV");

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8080;

configEV(app, path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
