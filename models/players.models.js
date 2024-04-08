const axios = require("axios");
const rateLimit = require("axios-rate-limit");

infoRequest = rateLimit(axios.create(), {
	maxRequests: 2,
	perMilliseconds: 50,
	maxRPS: 40,
});

const fs = require("fs");

function getFSPlayersProfileId() {
	return new Promise(function (resolve, reject) {
		fs.readFile("./database/fs_steam_ids.txt", "utf-8", (err, players) => {
			if (err) {
				reject(err);
			} else {
				const data = players.split("\n");
				resolve(data);
			}
		});
	});
}

function getPlayerInfo(player) {
	const playerInfoUrl = `https://aoe-api.reliclink.com/community/leaderboard/GetPersonalStat?title=age2`;
	let parameters = {};

	if (player.hasOwnProperty("profile_id")) {
		parameters = {
			profile_ids: `[${player.profile_id}]`,
		};
	} else if (player.hasOwnProperty("steam_id")) {
		parameters = {
			profile_names: `["/steam/${player.steam_id}"]`,
		};
	} else
		parameters = {
			aliases: `[${player.nickname}]`,
		};

	return new Promise(function (resolve, reject) {
		infoRequest({
			method: "get",
			url: playerInfoUrl,
			params: parameters,
		})
			.then((playerInfo) => {
				playerInfo.data.leaderboardStats =
					playerInfo.data.leaderboardStats.sort(
						(a, b) => a.leaderboard_id - b.leaderboard_id
					);

				playerInfo.data.leaderboardStats =
					playerInfo.data.leaderboardStats.filter(
						(leaderboard) =>
							leaderboard.leaderboard_id === 3 ||
							leaderboard.leaderboard_id === 4
					);

				if (playerInfo.data.leaderboardStats.length > 1) {
					const playerData = {
						nick: playerInfo.data.statGroups[0].members[0].alias,
						country:
							playerInfo.data.statGroups[0].members[0].country,
						rm1v1Stats: {
							rating: playerInfo.data.leaderboardStats[0].rating,
							wins: playerInfo.data.leaderboardStats[0].wins,
							losses: playerInfo.data.leaderboardStats[0].losses,
							streak: playerInfo.data.leaderboardStats[0].streak,
							drops: playerInfo.data.leaderboardStats[0].drops,
							highestrating:
								playerInfo.data.leaderboardStats[0]
									.highestrating,
						},
						rmTGStats: {
							rating: playerInfo.data.leaderboardStats[1].rating,
							wins: playerInfo.data.leaderboardStats[1].wins,
							losses: playerInfo.data.leaderboardStats[1].losses,
							streak: playerInfo.data.leaderboardStats[1].streak,
							drops: playerInfo.data.leaderboardStats[1].drops,
							highestrating:
								playerInfo.data.leaderboardStats[1]
									.highestrating,
						},
					};
					resolve(playerData);
				}
				if (playerInfo.data.leaderboardStats.length === 1) {
					const playerData = {
						nick: playerInfo.data.statGroups[0].members[0].alias,
						country:
							playerInfo.data.statGroups[0].members[0].country,
						rm1v1Stats: {
							rating: playerInfo.data.leaderboardStats[0].rating,
							wins: playerInfo.data.leaderboardStats[0].wins,
							losses: playerInfo.data.leaderboardStats[0].losses,
							streak: playerInfo.data.leaderboardStats[0].streak,
							drops: playerInfo.data.leaderboardStats[0].drops,
							highestrating:
								playerInfo.data.leaderboardStats[0]
									.highestrating,
						},
						rmTGStats: {
							rating: 0,
							wins: 0,
							losses: 0,
							streak: 0,
							drops: 0,
							highestrating: 0,
						},
					};

					resolve(playerData);
				}
			})
			.catch((err) => {
				reject(err);
			});
	});
}

function getFSRank1v1Info() {
	return getFSPlayersProfileId().then((data) => {
		const playersArray = data.map((player) =>
			getPlayerInfo({ steam_id: player })
		);

		return Promise.all(playersArray).then((players) => {
			let ranking = [];

			players.forEach((player) => {
				ranking.push({
					nickname: player.nick,
					rating: player.rm1v1Stats.rating,
				});
			});

			ranking = ranking.sort((a, b) => b.rating - a.rating);

			let strRanking = "Fellowsheep RM 1v1 Ranking: <br><br>";

			for (let i = 1; i < ranking.length + 1; i++) {
				strRanking += `${i} - ${ranking[i - 1].nickname} - ${
					ranking[i - 1].rating
				}<br>`;
			}

			return strRanking;
		});
	});
}

function getFSRankTgInfo() {
	return getFSPlayersProfileId().then((data) => {
		const playersArray = data.map((player) =>
			getPlayerInfo({ steam_id: player })
		);

		return Promise.all(playersArray).then((players) => {
			let ranking = [];

			players.forEach((player) => {
				ranking.push({
					nickname: player.nick,
					rating: player.rmTGStats.rating,
				});
			});

			ranking = ranking.sort((a, b) => b.rating - a.rating);

			let strRanking = "Fellowsheep Team Game Ranking: <br><br>";

			for (let i = 1; i < ranking.length + 1; i++) {
				strRanking += `${i} - ${ranking[i - 1].nickname} - ${
					ranking[i - 1].rating
				}<br>`;
			}

			return strRanking;
		});
	});
}

function getFSRankMaxInfo() {
	return getFSPlayersProfileId().then((data) => {
		const playersArray = data.map((player) =>
			getPlayerInfo({ steam_id: player })
		);

		return Promise.all(playersArray).then((players) => {
			let ranking = [];

			players.forEach((player) => {
				ranking.push({
					nickname: player.nick,
					rating1v1: player.rm1v1Stats.highestrating,
					ratingTG: player.rmTGStats.highestrating,
				});
			});

			ranking = ranking.sort((a, b) => b.highestrating - a.highestrating);

			let strRanking = "Fellowsheep Maximum rating Ranking: <br><br>";

			for (let i = 1; i < ranking.length + 1; i++) {
				strRanking += `${i} - ${ranking[i - 1].nickname} - 1v1: ${
					ranking[i - 1].rating1v1
				} - TG: ${ranking[i - 1].ratingTG}<br>`;
			}

			return strRanking;
		});
	});
}

module.exports = {
	getPlayerInfo,
	getFSRank1v1Info,
	getFSRankTgInfo,
	getFSRankMaxInfo,
};
