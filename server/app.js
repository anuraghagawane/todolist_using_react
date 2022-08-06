const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todo");

const todoschema = {
  item: String,
};

const Item = mongoose.model("Item", todoschema);

const item1 = new Item({
  item: "Add New Tasks",
});

const defaultItems = item1;

app.get("/", (req, res) => {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (!err) {
          // console.log("Success");
        }
        res.redirect("/");
      });
    } else {
      res.json(foundItems);
    }
  });
});

app.post("/", async (req, res) => {
  const itemToBeAdded = req.body;

  const newItem = new Item(itemToBeAdded);
  await newItem.save();
  res.json(itemToBeAdded);
});

app.post("/delete", async (req, res) => {
  const itemToBeDeleted = req.body;

  await Item.findByIdAndDelete(itemToBeDeleted, function (err) {
    if (!err) {
      res.json(itemToBeDeleted);
    }
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
