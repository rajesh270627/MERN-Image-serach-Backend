
const express = require("express");
const fetch = require("node-fetch"); 
const router = express.Router();
const Search = require("../models/searchModel");

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;




router.get("/top-searches", async (req, res) => {
  try {
    
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    const top = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json(top);
  } catch (err) {
    console.error("Error fetching top searches:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/search", async (req, res) => {
  const { term, page } = req.body;
  const userId = req.user ? req.user._id : null;

  if (!term) return res.status(400).json({ error: "Search term required" });

  try {
    
    await Search.create({
      userId,
      term: term.trim(),
      timestamp: new Date()
    });

   
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=30&page=${page || 1}`
    );

    const data = await response.json();
    console.log("✅ Full Unsplash Response:", data);
    console.log("✅ Photos Found:", data.results?.length);

    res.json({ term, results: data.results || [] });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "API failed" });
  }
});

  


router.get("/history", async (req, res) => {
  const userId = req.user ? req.user._id : null;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const history = await Search.find({ userId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
