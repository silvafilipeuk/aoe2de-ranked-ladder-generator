const app = require("./app");
const https = require("https")
const fs = require("fs")

const PORT = 80;
const PORTHTTPS = 443;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

https.createServer(app).listen(PORTHTTPS, () => {
	console.log("https server listening on port 443");
})
