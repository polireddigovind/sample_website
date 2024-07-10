const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.BASE_ID;
const TABLE_NAME = process.env.TABLE_NAME;

// Airtable API URL
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Discover API key
const DISCOVER_API_KEY = process.env.DISCOVER_API_KEY;

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  res.json({ success: true });
  // try {
  //   const response = await axios.get(AIRTABLE_URL, {
  //     headers: {
  //       Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  //     },
  //     params: {
  //       filterByFormula: `AND({Username} = '${username}', {Password} = '${password}')`,
  //     },
  //   });

  //   if (response.data.records.length > 0) {
  //     res.json({ success: true });
  //   } else {
  //     res.status(401).json({ success: false, message: "Invalid credentials" });
  //   }
  // } catch (error) {
  //   console.error("Error message:", error.message);
  //   res.status(500).json({ error: error.message });
  // }
});

// Search Route
app.get("/search", async (req, res) => {
  try {
    const response = await axios.get("https://api.discolike.com/v1/discover", {
      params: req.query,
      headers: {
        "x-discover-key": DISCOVER_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error("Error request:", error.request);
      res.status(500).json({ error: error.message });
    }
  }
});

// Serve the login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve the home page
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home_page.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});