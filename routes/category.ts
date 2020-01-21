(function () {
// #region Variables deceleration
const categoryExpress = require("express");
const categoryRouter = categoryExpress.Router();
var Category = require("../models/category.ts");
const { check,oneOf, validationResult } = require('express-validator');
// #endregion

// #region Validators deceleration
const newcategory = [
    check("category_name", "category_name is required")
    .not()
    .isEmpty().withMessage("category_name must not be empty")
    .isLength({ min: 2,max:25 }).withMessage("category_name long min is : 2 chars max is : 25 chars"),
    // .isAlpha().withMessage("category_name must be string"),
]

const updatecategory = oneOf(
    [
      [
      check("category_name").exists() 
      .not()
      .isEmpty().withMessage("category_name must not be empty")
      .isLength({ min: 2,max:25 }).withMessage("category_name long min is : 2 chars max is : 25 chars")
    //   .isAlpha().withMessage("category_name must be string")
     ]
]
);
// #endregion

// #region Routes
categoryRouter.post("/",newcategory,async(req,res)=>{ // new category
    const errors = validationResult(req);
    try {
    if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),responseMsg:"Validation Error while add a new category",success:false
            });
        }
            const addedcategory = await new Category(req.body);
            await addedcategory.save();
            return res.status(200).json({ message: "category added successfully" , success:true});
          } catch (err) {
            return res.status(400).json({err:err,msg:"Error occured while add a new category",success:false});
          }
        })
categoryRouter.get("/",async(req,res)=>{ // get all categorys
    try {
        const allcategorys = await Category.find({});
        return res.status(200).json({response:allcategorys,success:true});
      } catch (err) {
        return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive all categorys "});
      }
})
categoryRouter.get("/:id",async(req,res)=>{ // get one category by id
    try {
        const category = await Category.find({ _id: req.params.id });
        return res.status(200).json({response:category,success:true});
      } catch (err) {
        return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive one category with id "});
      }    
})
categoryRouter.patch("/:id",updatecategory,async(req,res)=>{ // edit one category
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),responseMsg:"Validation Error while update a category",success:false
            });
        }
     const result = await Category.updateOne({_id:req.params.id},req.body)
        if(result){
            return res.status(200).json({responseMsg:"category changed successfully",success:true});
        }
    }catch(err){
        return res.status(200).json({responseMsg:"category changed unsuccessfully",success:false,response:err});
    }
})
categoryRouter.delete("/:id",async(req,res)=>{ // delete one category
    try{
        const result = await Category.deleteOne({_id:req.params.id})
             if(result){
            return res.status(200).json({responseMsg:"category deleted successfully",success:true});
                      }
    }catch(err){
        return res.status(200).json({responseMsg:"category deleted unsuccessfully",success:false,response:err});
    }
})
// #endregion
module.exports = categoryRouter;
})();
