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
  origin: process.env.CORS_ORIGIN ?
    process.env.CORS_ORIGIN.split(',') :
    [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://kiki-testimonial-client.vercel.app'
    ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Handle CORS and preflight early for all routes (important on serverless platforms)
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Safety net: explicitly set headers for allowed origins to avoid any drops
const allowedOrigins = corsOptions.origin;
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  const isAllowed = Array.isArray(allowedOrigins)
    ? allowedOrigins.includes(requestOrigin)
    : true; // if provided via env functionally equivalent

  if (requestOrigin && isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});
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

// Initialize database connection
connected();

// Export for Vercel serverless functions
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(port, async () => {
    console.log(`🚀 server running on PORT: ${port}`);
  });
}
