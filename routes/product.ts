
// #region Variables deceleration
const productExpress = require("express");
const productRouter = productExpress.Router();
var Product = require("../models/product.ts");
const { check,oneOf, validationResult } = require('express-validator');
// #endregion

// #region Validators deceleration
const newProduct = [
    check("product_name", "product_name is required")
    .not()
    .isEmpty().withMessage("product_name must not be empty")
    .isLength({ min: 2,max:25 }).withMessage("product_name long min is : 2 chars max is : 25 chars"),
    // .isAlpha().withMessage("product_name must be string"),

    check("product_price", "product_price is required")
    .not()
    .isEmpty().withMessage("product_price must not be empty")
    .isNumeric().withMessage('product_price must be number')
    .isLength({ min: 1,max:5 }).withMessage('product_price long min is : 1 number and max is 5 number')
]

const updateProduct = oneOf(
    [
      [
      check("product_name").exists() 
      .not()
      .isEmpty().withMessage("product_name must not be empty")
      .isLength({ min: 2,max:25 }).withMessage("product_name long min is : 2 chars max is : 25 chars")
    //   .isAlpha().withMessage("product_name must be string")
     ],
      [
      check("product_price").exists()
      .not()
      .withMessage("product_price is required")
      .isEmpty().withMessage("product_price must not be empty")
      .isNumeric().withMessage('product_price must be number')
      .isLength({ min: 1,max:5 }).withMessage('product_price long min is : 1 number and max is 5 number')
      ]  
]
);
// #endregion

// #region Routes
productRouter.post("/",newProduct,async(req,res)=>{ // new product
    const errors = validationResult(req);
    try {
    if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),responseMsg:"Validation Error while add a new product",success:false
            });
        }
            const addedProduct = await new Product(req.body);
            await addedProduct.save();
            return res.status(200).json({ message: "Product added successfully" , success:true});
          } catch (err) {
            return res.status(400).json({err:err,msg:"Error occured while add a new product",success:false});
          }
        })
productRouter.get("/",async(req,res)=>{ // get all products
    try {
        const allProducts = await Product.find({});
        return res.status(200).json({response:allProducts,success:true});
      } catch (err) {
        return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive all products "});
      }
})
productRouter.get("/:id",async(req,res)=>{ // get one product by id
    try {
        const product = await Product.find({ _id: req.params.id });
        return res.status(200).json({response:product,success:true});
      } catch (err) {
        return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive one product with id "});
      }    
})
productRouter.patch("/:id",updateProduct,async(req,res)=>{ // edit one product
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),responseMsg:"Validation Error while update a product",success:false
            });
        }
     const result = await Product.updateOne({_id:req.params.id},req.body)
        if(result){
            return res.status(200).json({responseMsg:"Product changed successfully",success:true});
        }
    }catch(err){
        return res.status(200).json({responseMsg:"Product changed unsuccessfully",success:false,response:err});
    }
})
productRouter.delete("/:id",async(req,res)=>{ // delete one product
    try{
        const result = await Product.deleteOne({_id:req.params.id})
             if(result){
            return res.status(200).json({responseMsg:"Product deleted successfully",success:true});
                      }
    }catch(err){
        return res.status(200).json({responseMsg:"Product deleted unsuccessfully",success:false,response:err});
    }
})
// #endregion

module.exports = productRouter;