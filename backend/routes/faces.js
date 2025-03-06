express = require("express");
const router = express.Router();
const pool  = require("../models/db");

/**
  * 1️⃣ Route to Add a New Thumbnail
  * POST /api/thumbnails
  */
  router.post("/",async(req,res)=>{
  try{
    const { faceImageUrl, fullName } = req.body;
    
    if(!faceImageUrl || !fullName){
        return res.status(400).json({error: "Thumbnail URL and Title are required"});
    }
    const result = await pool.query(
        "INSERT INTO faces (face_image_url, full_name, votes, rating) VALUES ($1, $2, 0,1500) RETURNING *",
        [faceImageUrl, fullName]
    );
    
    res.status(201).json(result.rows[0]);
    } catch(error){
        console.error("Error adding thumbnail:", error);
        res.status(500).json({error: "Internal server Error"});
    }  
  });
 
/**
  * @desc   Retrieve all faces with pagination
  * @route  GET /api/faces
  * @access Public
*/

  router.get("/", async (req, res) => {
    try {
        const queryText = "SELECT * FROM faces ORDER BY id DESC";
        const result = await pool.query(queryText);
        res.status(200).json(result.rows);
        } catch (error) {
          console.error("Error fetching faces:", error);
          res.status(500).json({ error: "Internal Server Error" });
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
                "UPDATE faces SET votes = votes + 1 WHERE id = $1 RETURNING *",
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
   router.post("/elo-vote", async(req,res) =>{
    try{
        const { winnerId, loserId} = req.body;

        if(!winnerId || !loserId){
            return res.status(400).json({error: " one or both id are required" });
        }

        const winnerResult = await pool.query("SELECT * FROM faces WHERE id = $1", [winnerId]);
        const loserResult = await pool.query("SELECT * FROM faces WHERE id = $1", [loserId]);

        if(winnerResult.rowCount == 0 || loserResult.rowCount ==0){
            return res.status(404).json({error: "one or both thumbnail not found"});
        }

        const winner = winnerResult.rows[0];
        const loser = loserResult.rows[0];

        //Ensure that both thumbnails have a rating value
        // (They should, since our column defaults to 1500)
        const K = 32; // K-factor for rating adjustment
        
        const expectedWinner = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
        const expectedLoser = 1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));
        
        const newWinnerRating = Math.round(winner.rating + K * (1 - expectedWinner));
        const newLoserRating = Math.round(loser.rating + K * (0 - expectedLoser));

        const updateLoser = await pool.query(
            "UPDATE faces SET rating = $1 WHERE id = $2 RETURNING *",[newLoserRating, loserId]
        );
        const updateWinner = await pool.query(
            "UPDATE faces SET rating = $1 WHERE id = $2 RETURNING *",
            [newWinnerRating, winnerId]
        );
        res.status(200).json({
            winner: updateWinner.rows[0],
            loser: updateLoser.rows[0]
        });
        } catch(error){
            console.error("ERROR updating ELO rating ", error);
            res.status(500).json({error: "INTERNAL SERVER ERROR"});
        }

   });

   router.get("/leaderboard", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM faces ORDER BY rating DESC LIMIT 10"
         );
         res.status(200).json(result.rows);
         } catch (error) {
            console.error("Error fetching leaderboard:", error);
            res.status(500).json({ error: "Internal Server Error" });
         }

   });

   module.exports = router;










