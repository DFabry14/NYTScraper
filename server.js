var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
var db = require("./models");

var PORT = 3000;

var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytscraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
  axios.get("https://www.nytimes.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("article").each(function (i, element) {
      var result = {};
      result.title = $(this)
        .children(".story-heading").text().trim();
      result.url = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children(".summary").text().trim();
      if (result.title && result.url && result.summary) {
        db.Article.create(result)
          .then(function (dbArticle) {
            console.log("INSIDE", dbArticle);
          })
          .catch(function (err) {
            return res.json(err);
          });
      }
    });
    res.redirect("/")
  });
});

app.get("/", function(req, res){
  db.Article.find({}).then(function(dbArticle){
    res.render("home", {articles: dbArticle})
  })
});

app.put("/articles/save/:id", function(req, res) {
  db.Article.findOneAndUpdate({_id: req.params.id}, {"saved": true}).then(function(){
    res.end();
  })
})

app.get("/saved", function (req, res) {
  db.Article.find({saved: true}).then(function(dbArticle){
    res.render("saved", {articles: dbArticle})
  })
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
