import app from "./app";

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log("Express server for stocks-api listening on port " + PORT);
});
