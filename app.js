const express = require("express");

const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const app = express();
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    db = await {
      filename: dbPath,
      driver: sqlite3.Database,
    };
    app.listen(3000, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log(`Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const conDbObjToResponseObj = (eachPlayer) => {
  return {
    playerId: eachPlayer.player_id,
    playerName: eachPlayer.player_name,
    jerseyNumber: eachPlayer.jersey_number,
    role: eachPlayer.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayerDetails = `
    SELECT 
        * 
    FROM 
        cricket_team`;

  const playersArray = await db.all(getPlayerDetails);
  response.send(
    playersArray.map((eachPlayer) => conDbObjToResponseObj(eachPlayer))
  );
});
