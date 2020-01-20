
// #region General declration
const productExpress = require("express");
const productRouter = productExpress.Router();
// #endregion


// #region Routes


productRouter.post("/",async(req,res)=>{ // new product
    res.send("product post api work good")
})

productRouter.get("/",async(req,res)=>{ // get all products
    res.send("get all products work")
})

productRouter.get("/:id",async(req,res)=>{ // get one product by id
    res.send(req.params['id'] + "get one product")
})

productRouter.patch("/:id",async(req,res)=>{ // edit one product
    res.send(req.params['id'] +" edit product")
})

productRouter.delete("/:id",async(req,res)=>{ // delete one product
    res.send(req.params["id"] + "delete product")
})


// #endregion

module.exports = productRouter;