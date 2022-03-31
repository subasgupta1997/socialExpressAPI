const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const app = express();
const morgan = require("morgan");
const userRoute = require("./router/users");
const authRoute = require("./router/auth.js");
const postRoute = require("./router/posts")
dotenv.config();
//connection
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("Database connected!"))
  .catch(err => console.log(err));;
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
//route
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//api creation subas

app.get("/", (req, res) => {
  res.send("welcome to homepage");
});

app.listen(8800, () => {
  console.log("Backend server is running");
});
