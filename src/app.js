const express = require('express');
const Student = require('./models/Student');

const app = express();

// middleware 
app.use(express.json());

// Routes

// Get all the students
app.get('/students', async (req, res) => {
    try {
        res.send(await Student.find());
    } catch (err) {
        res.sendStatus(404);
    }
})

// Add student to database
app.post("/students", async (req, res) => {
    const newStudent = req.body;
    try {
        const newStudentDoc = new Student(newStudent);
        await newStudentDoc.save();
        res.send(newStudentDoc);
    }
    catch (err) {
        res.sendStatus(404);
    }

});

// Get specific student
app.get('/students/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const student = await Student.findById({ id, });
        res.send({ student });
    } catch (err) {
        res.sendStatus(404);
    }
})

// delete specific student
app.delete("/students/:id", async (req, res) => {

    if (req.params.type.toLowerCase() === "soft") {
        await Student.updateOne({ _id: req.params.id }, { isDeleted: true });
    }
    else if (req.query.type.toLowerCase() === "hard") {
        await Student.deleteOne({ _id: req.params.id });
    }
});


module.exports = app;