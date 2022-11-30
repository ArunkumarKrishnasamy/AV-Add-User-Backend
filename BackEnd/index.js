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
    let user = await db
      .collection("Registered Users")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in Finding user",
    });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);
    let db = connection.db("Users");
    await db
      .collection("Registered Users")
      .updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });

    await connection.close();
    res.json({ message: "User info Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in Editing user",
    });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);
    let db = connection.db("Users");
    await db
      .collection("Registered Users")
      .deleteOne({ _id: mongodb.ObjectId(req.params.id) });

    // let userIndex = users.findIndex((obj) => obj._id == req.params.id);
    // let id = users[userIndex]._id;
    // users.splice(userIndex, 1);
    await connection.close();
    res.json({ message: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in Deleting user",
    });
  }
});

app.listen(PORT, () => {
  console.log("web Server started");
});
