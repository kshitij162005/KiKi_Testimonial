const express = require("express");
const Router = require("./routes.js");
const { isConnected, connected } = require("./db.js");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
const upload=require('./uploads.js');

dotenv.config();

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  try {
    res.json({
      database: isConnected() ? "connected" : "disconnected",
    });
  } catch (err) {
    console.log(err);
  }
});
app.use(Router);

if (require.main === module) {
  connected();
  app.listen(port, async () => {
    console.log(`🚀 server running on PORT: ${port}`);
  });
}
