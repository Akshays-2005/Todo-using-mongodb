const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const trySchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("task", trySchema);

app.get("/", function (req, res) {
    Item.find({})
        .then(foundItems => {
            res.render("list", { ejes: foundItems });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/", function (req, res) {
    const itemName = req.body.ele1;
    if (!itemName) return res.redirect("/?error=empty");
    const todo = new Item({
        name: itemName
    });
    todo.save();
    res.redirect("/");
});

app.post("/delete", function (req, res) {
    const checked = req.body.checkbox1;
    Item.findByIdAndDelete(checked)
        .then(() => {
            console.log("Deleted");
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(port, function () {
    console.log("Server started");
});