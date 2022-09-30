const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require('dotenv').config()
const URL = process.env.DB;

//middleware
app.use(express.json());


//1.Creating a  Mentor
app.post("/mentor", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("mentorstudent");
    await db.collection("mentors").insertOne(req.body);
    await connection.close();

    res.json({
      message: "Mentor added!!!",
    });
  } catch (error) {
    console.log(error);
  }
});

//2.Creating  a Student
app.post("/student", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("mentorstudent");
    await db.collection("students").insertOne(req.body);
    await connection.close();

    res.json({
      message: "student added!!!",
    });
  } catch (error) {
    console.log(error);
  }
});

//3.Get  all Mentors
app.get("/mentors", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("mentorstudent");
    const mentors = await db.collection("mentors").find().toArray();
    await connection.close();

    res.json(mentors);
  } catch (error) {
    console.log(error);
  }
});

//4.get all  students
app.get("/students", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("mentorstudent");
    const students = await db.collection("students").find().toArray();
    await connection.close();

    res.json(students);
  } catch (error) {
    console.log(error);
  }
});

//assign students to mentor
app.put("/mentor/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("mentorstudent");
    await db
      .collection("mentors")
      .updateOne(
        { _id: mongodb.ObjectId(req.params.id) },
        { $push: { students: mongodb.ObjectId(req.body) } }
      );
    res.json({
      message: "Assigned students",
    });
  } catch (error) {
    console.log(error);
  }
});

//assign mentor to student
app.put("/student/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("mentorstudent");
    await db.collection("students").updateOne(
      { _id: mongodb.ObjectId(req.params.id) },
      // { $push: { mentor: req.body } }
      { $set: { mentor: req.body } }
    );
    res.json({
      message: "assigned  mentor",
    });
  } catch (error) {
    console.log(error);
  }
});

//get student for particular mentor
app.get("/mentor/:id/assignedstudents", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("mentorstudent");
    const mentors = await db
      .collection("mentors")
      .find(
        { _id: mongodb.ObjectId(req.params.id) },
        { name: 1, students: 1, _id: 1 }
      )
      .toArray();
    await connection.close();

    res.json(mentors);
  } catch (error) {
    console.log(error);
  }
});

//get students without mentor
app.get("/nomentors", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("mentorstudent");
    const students = await db
      .collection("students")
      .find({ mentor: undefined })
      .toArray();
    await connection.close();

    res.json(students);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || 3001);