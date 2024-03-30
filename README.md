# AOE2de - RANKED LADDER - Ranking generator 1v1 and TG's

## AGE OF EMPIRES 2 DE - Ranked ladder ranking generator:

JS function to lookup and retrieve player information on the ranked ladder for a given list of player IDS.

The function will use the aoe2companion.com API to retreive the Player data and display it in an orderer ranking.

Ranking will be available for 1v1 and Team games.

Solution will be implemented using TDD with jest.

## Config:

-   database/players.txt - List with the players ID's that you want the system to generate the ranking. (one per line)

-   makeRanking(leaderboard_id) - Call the function passing the ID of the leaderboard you want to generate the ranking. 3 - RM 1v1 / 4 - Team RM (Default 3)

-   makeRanking() returns a promise... When resolved returns an array of objects {nickname: XXX, elo: 1111}

## Example of usage:

```
makeRanking(3).then((data) => {
console.log(data);
})
.catch((err) => {
console.log("Error generating the ranking: ", err);
});
```

An API is planned to be implemented in the future for be used on any website.

## Instalation:

-   git clone https://github.com/silvafilipeuk/aoe2de-ranked-ladder-generator.git
-   npm install
-   edit database/players.txt with the player_id's that you want to generate the ranking for. (one player_id per line)
-   node getPlayerInfo.js
