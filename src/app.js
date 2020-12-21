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
        const student = await Student.findById(id);
        res.send(student);
    } catch (err) {
        res.sendStatus(404);
    }

})

// delete specific student
app.delete("/students/:id", async (req, res) => {
    const id = req.params.id;
    const type = req.query.type;

    if (type === "soft") {
        try {
            const studentToDel = await Student.findById(id);
            studentToDel.isDeleted = true;
            await studentToDel.save();
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(404);
        }
    } else {
        try {
            const studentToDel = await Student.findById(id);
            await Student.deleteOne({ _id: id });
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(404);
        }
    }
});


module.exports = app;

