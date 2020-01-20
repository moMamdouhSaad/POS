
// #region Variables deceleration
const productExpress = require("express");
const productRouter = productExpress.Router();
const { check, validationResult } = require('express-validator');
// #endregion

// #region Validators deceleration
const newProduct = [
    check("freeFormatAddress", "freeFormatAddress is required")
    .not()
    .isEmpty()]
// #endregion

// #region Routes

productRouter.post("/",newProduct,async(req,res)=>{ // new product
    const errors = validationResult(req);
    if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array()
            });
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