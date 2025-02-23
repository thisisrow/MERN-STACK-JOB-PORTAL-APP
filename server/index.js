const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

//DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to the Job Portal API");
});


//PORT
const PORT = process.env.PORT || 3000;

//listen
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});