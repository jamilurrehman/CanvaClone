const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cros = require("cors");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

// what is the meaning of this ?
if (process.env.NODE_ENV === "local") {
  app.use(
    cros({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
} else {
  app.use(
    cros({
      credentials: true,
    })
  );
}

// what is this ? : 😕
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./", "frontend", "dist", "index.html"));
  });
}

// Database connection
const dbConnect = async () => {
  try {
    if (process.env.NODE_ENV === "local") {
      await mongoose.connect(process.env.LOCAL_DB_URI);
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to mongodb Atlas");
    }
  } catch (error) {
    console.error("Mongodb connection faild", error);
  }
};
dbConnect();
// ----------------------------------------

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is runnig on port ${PORT} `);
});
