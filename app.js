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
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
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

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const createPlayerDetails = `
  INSERT INTO 
    cricket_team(player_name, jersey_number, role)
  VALUES
    ('${playerName}',
    ${jerseyNumber},
    '${role}');
   `;
  const player = await db.run(createPlayerDetails);
  response.send("Player Added to Team");
});

const returningObject = (dbresponse) => {
  return {
    playerId: dbresponse.player_id,
    playerName: dbresponse.player_name,
    jerseyNumber: dbresponse.jersey_number,
    role: dbresponse.role,
  };
};

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `SElECT * FROM cricket_team
    WHERE player_id=${playerId}`;
  const dbresponse = await db.get(query);
  response.send(returningObject(dbresponse));
});

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `
  UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE 
    player_id = ${playerId}`;

  const updatedQuery = await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const delPlayer = `
    DELETE FROM 
     cricket_team
    WHERE
     player_id = ${playerId}`;

  const delQuery = await db.run(delPlayer);
  response.send("Player Removed");
});
