const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true }); // Add useNewUrlParser and useUnifiedTopology options

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get((req, res) => {
  Article.find({}).then((data)=>{
    res.send(data);
  });
})
.post((req,res)=>{
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save().then(() => {
    res.send("Successfully added an article");
  })
  .catch(err => {
    res.status(400).send(err); // Send a 400 Bad Request status with error message
  });
})
.delete((req,res)=>{
  Article.deleteMany({}).then(() => {
    res.send("Successfully deleted all articles");
  })
  .catch(err => {
    res.status(500).send(err); // Send a 500 Internal Server Error status with error message
  });
});

app.route("/articles/:article")
.get((req,res)=>{
  Article.findOne({title: req.params.article}).then((data)=>{
    res.send(data);
  });
})
.put((req,res)=>{
  Article.updateOne(
    {title: req.params.article},
    {title: req.body.title, content: req.body.content},
    {overwrite: true}
  )
  .then(() => {
    console.log("Successfully updated article");
    res.sendStatus(204); // Send a successful response with no content
  })
  .catch(err => {
    console.error("Error updating article:", err);
    res.sendStatus(500); // Send an internal server error response
  });
})
.delete((req,res) => {
  Article.deleteOne({title: req.params.article}).then(() => {
    console.log("Successfully deleted article");
    res.sendStatus(204); // Send a successful response with no content
  })
  .catch(err => {
    console.error("Error deleting article:", err);
    res.sendStatus(500); // Send an internal server error response
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
