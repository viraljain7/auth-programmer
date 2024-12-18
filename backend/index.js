import express from "express";
import connectDB from "./db/connectDB.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!!!");
})

app.listen(3000, () => {
    connectDB()
    console.log(`Server is running on port : ${port}`);
});