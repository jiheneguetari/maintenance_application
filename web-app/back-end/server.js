const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/machines", require("./routes/machines"));
app.use("/api/users", require("./routes/users"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/reports", require("./routes/reports"));

//app.use("/esp", require("./routes/esp"));   
// IoT route

app.listen(process.env.PORT, () =>
  console.log(`Backend lancé sur le port ${process.env.PORT} ✔`)
);
