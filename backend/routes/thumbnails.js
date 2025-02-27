express = require("express");
const router = express.Router();
const pool  = require("../models/db");

/**
  * 1️⃣ Route to Add a New Thumbnail
  * POST /api/thumbnails
  */
  router.post("/",async(req,res)=>{
  try{
    const { youtubeThumbnailUrl, title } = req.body;
    
    if(!youtubeThumbnailUrl || !title){
        return res.status(400).json({error: "Thumbnail URL and Title are required"});
    }
    const result = await pool.query(
        "INSERT INTO thumbnails (youtube_thumbnail_url, title, votes) VALUES ($1, $2, 0) RETURNING *",
        [youtubeThumbnailUrl, title]
    );

    res.status(201).json(result.rows[0]);
    } catch(error){
        console.error("Error adding thumbnail:", error);
        res.status(500).json({error: "Internal server Error"});
    }  
  });

  /**
   * 3️⃣ Route to Vote for a Thumbnail
   * POST /api/thumbnails/vote
   */

   router.post("/votes", async(req,res) => {
        try{
            const { id } = req.body;

            if(!id){
                return res.status(400).json({error: " Thumbnail ID is required"});
            }

            const result = await pool.query(
                "UPDATE thumbnails SET votes = votes + 1 WHERE id = $1 RETURNING *",
                [id]
            );

            if(result.rowCount == 0){
                return res.status(404).json({error: "Thumbnail is not found"});
            }
            res.status(200).json(result.rows[0]);
            } catch(error){
                console.error("Error Updating vote:", error);
                res.status(500).json({error: "Internal Server Error"});
            }

   });

   router.get("/leaderboard", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM thumbnails ORDER BY votes DESC LIMIT 10"
         );
         res.status(200).json(result.rows);
         } catch (error) {
            console.error("Error fetching leaderboard:", error);
            res.status(500).json({ error: "Internal Server Error" });
         }

   });

   module.exports = router;










