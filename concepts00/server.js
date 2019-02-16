const express = require("express")

const app = express();

app.get('/', (req, res) => {
	console.log("Hello world!");
	res.status(200).send("Hello world");
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
