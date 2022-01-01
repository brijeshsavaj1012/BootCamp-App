const express = require("express");
const path = require("path");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const ratelimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

//load env var
dotenv.config({ path: "./config/config.env" });

//connect database
connectDB();

//route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

//body Parser
app.use(express.json());

// dev logging middleware
app.use(morgan("dev"));

//File Uploading
app.use(fileupload());

//mongo sanitize
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//prevent from XSS attacks ... html tag
app.use(xss());

//rate limiting
const limiter = ratelimit({
  windowMs: 10 * 60 * 1000, //10 minit
  max: 100,
});
app.use(limiter);

//prevent http param solution
app.use(hpp());

//enable cors
app.use(cors());

//cookie Parser
app.use(cookieParser());

//set Static folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1/auth", auth);
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `server running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  )
);

// Handle unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  server.close(() => process.exit(1));
});
