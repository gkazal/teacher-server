const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 6066;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello teachers!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uhlcz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const courseCollection = client.db("teacher").collection("courses");

  // add service from admin to database from Service.js

  app.post("/addCourse", (req, res) => {
    const newServices = req.body;
    console.log("adding new service", newServices);
    courseCollection.insertOne(newServices).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/course", (req, res) => {
    courseCollection.find().toArray((err, items) => {
      console.log("from database", items);
      res.send(items);
    });
  });

  console.log("teachers database connected");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
