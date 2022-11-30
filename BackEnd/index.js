const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3001 || process.env.PORT;

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb://localhost:27017";
app.post("/users", async (req, res) => {
  try {
    // open the connection
    let connection = await mongoClient.connect(URL);
    //  connect with db
    let db = connection.db("Users");
    // Select the collections
    await db.collection("Registered Users").insertOne(req.body);
    //   close the connection
    await connection.close();
    res.json({
      message: "New user added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in adding User",
    });
  }
  app.get("/users", async (req, res) => {
    try {
      let connection = await mongoClient.connect(URL);
      let db = connection.db("Users");
      let users = await db.collection("Registered Users").find().toArray();
      await connection.close();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in getting user data",
      });
    }
  });
});

app.get("/users/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);
    let db = connection.db("Users");
    let users = await db.collection("Registered Users").find().toArray();
    console.log(req.params.id);

    // let user = await db
    //   .collection("Registered Users")
    //   .findOne({ _id: req.params.id });
    let userIndex = users.findIndex((obj) => obj._id == req.params.id);
    // console.log(users[userIndex]);
    await connection.close();
    res.json(users[userIndex]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in Finding user",
    });
  }
});

app.listen(PORT, () => {
  console.log("web Server started");
});
