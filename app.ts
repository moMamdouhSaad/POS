
// #region General Decelration
const express = require("express");
const app = express();
const server = require("http").createServer(app);
var bodyParser = require("body-parser");
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
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, authtoken, X-Requested-With"
    );
    next();
  });
  // #endregion

// #region routes
//TODO : TEST BACKEND SERVICE
app.use("/api/product", require("./routes/product.ts"));
app.use("/api/category", require("./routes/category.ts"));
app.use("/api/table", require("./routes/table.ts"));
app.use("/api/taxrate", require("./routes/taxrate.ts"));
app.use("/api/bill", require("./routes/bill.ts"));
app.use("/api/customer", require("./routes/customer.ts"));

// #endregion

// #region Server Listen
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}...`));
// #endregion