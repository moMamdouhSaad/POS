
// #region General Decelration
const express = require("express");
const app = express();
const server = require("http").createServer(app);
// #endregion


// #region Midllewares

// #endregion


// #region routes

app.get('/test',async(req,res)=>{
    res.send("tmam")
})
app.use("/api/product", require("./routes/product.ts"));

// #endregion



const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}...`));