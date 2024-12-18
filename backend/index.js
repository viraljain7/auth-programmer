import express from "express";
import connectDB from "./db/connectDB.js";
import { authRoutes } from "./routes/auth.route.js";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World!!!");
})
app.use(express.json()); //allows us to parse incoming requests with request :req.body
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    connectDB()
    console.log(`Server is running on port : ${port}`);
});