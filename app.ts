
// #region General Decelration
const express = require("express");
const app = express();
const server = require("http").createServer(app);
var bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
var User = require("./models/user.ts");
const bcrypt = require("bcrypt");

// #endregion

//#region DB CONNECTION
var mongoose = require("mongoose");
var connectioString =
  "mongodb+srv://admin:paapyAdmin@janssen-ivvaz.mongodb.net/test?retryWrites=true&w=majority";
const connection = mongoose
  .connect(connectioString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "POS"
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
      console.log
    console.log("not connected");
  });
mongoose.set("useFindAndModify", false);
//#endregion

// #region Midllewares
// app.use(express.static(__dirname + "/public"));
//check for headers request security
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type,Accept,authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, authtoken, X-Requested-With"
    );
    next();
  });
  // #endregion

// #region routes
//TODO : TEST BACKEND SERVICE

//Authenticate Route

app.post('/auth',  async (req, res, next) => {
  console.log(req.body)
  const user = await User.findOne({'username' : req.body.username});
  if(user){
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if(result){
        var token = jwt.sign({userID: user.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
        res.status(200).json({token});
      }
      else{
        console.log(err)
        res.status(401).json({msg:"wrong password"});
      }
    });
  }else{
    res.status(401).json({msg:"wrong username"});

  }
 
});
//
app.use("/api/product", require("./routes/product.ts"));
app.use("/api/category", require("./routes/category.ts"));
app.use("/api/table", require("./routes/table.ts"));
app.use("/api/taxrate", require("./routes/taxrate.ts"));
app.use("/api/bill", require("./routes/bill.ts"));
app.use("/api/customer", require("./routes/customer.ts"));
app.use("/api/user", require("./routes/user.ts"));

// #endregion

// #region Server Listen
const port = process.env.PORT || 80;
server.listen(port ,() => console.log(`Listening on port ${port}...`));
// #endregion