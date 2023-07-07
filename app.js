const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const authRoutes = require("./routes/auth");
const AuthenticateUser = require("./models/userSchema");
const passport = require("passport");

const adminRoutes = require("./routes/admin");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
    // Start your application or perform further operations
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});


app.set("view engine", "ejs");

app.use(
  session({
    secret: "yugasa",
    resave: false,
    saveUninitialized: false,
    store: store,
    debug: true,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  AuthenticateUser.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

app.use(passport.initialize());
require("./config/passport")

app.use(authRoutes);
app.use("/admin" ,passport.authenticate("jwt",{session:false}),adminRoutes)

app.listen(3000);
