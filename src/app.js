const express = require('express');
const Student = require('./models/Student');

const app = express();

// middleware 
app.use(express.json());

// Routes
const isNullOrUndefined = (val) => val === null || val === undefined;
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
    const student = await Student.findOne({ _id: id });

    if (isNullOrUndefined(student)) {
        res.sendStatus(404);
    } else if (student.isDeleted === true) {
        await Student.updateOne({ _id: id }, { isDeleted: false });
        res.send(await Student.findOne({ _id: id }));
    }
    res.send(student);
})

// delete specific student
app.delete("/students/:id", async (req, res) => {
    const id = req.params.id;
    const type = req.query.type;
    console.log(id, type);

    const getStudent = await Student.findById(id);

    if (isNullOrUndefined(getStudent) && isNullOrUndefined(type)) {
        res.sendStatus(404);
    } else {
        if (type.toLowerCase() === "soft") {
            if (getStudent.isDeleted === true) {
                res.sendStatus(404);
            } else {
                await Student.updateOne({ _id: id }, { isDeleted: true });
                res.sendStatus(200);
            }
        }
        else if (type.toLowerCase() === "hard") {
            if (getStudent.isDeleted === true) {
                res.sendStatus(404);
            } else {
                await Student.deleteOne({ _id: id });
                res.sendStatus(200);
            }
        }
    }
});


module.exports = app;