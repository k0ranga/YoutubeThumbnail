require("dotenv").config();
const fetch = require("node-fetch");
const pool = require("../models/db");

const API_URL = "https://randomuser.me/api/?results=10&gender=female";

async function fetchFaces(){
    try{
        const response = await fetch(API_URL);
        const data = await response.json();

        const faces = data.results.map(user => ({
            faceImageUrl: user.picture.large,
            fullName: `${user.name.first} ${user.name.last}`
        }));

        for(const face of faces){
            await pool.query(
                "INSERT INTO faces (face_image_url, full_name, votes, rating) Values($1 ,$2, 0, 1500)",
                [face.faceImageUrl, face.fullName]
        );

        console.log(` Added: ${face.fullName}`);
     }
     console.log(' DATABASE succesfully populated with faces!');
     } catch(error){
        console.error(" ERROR FETCHING FACES:", error);
     }
    }

    fetchFaces();
