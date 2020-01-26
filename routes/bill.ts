(function () {
    // #region Variables deceleration
    const billExpress = require("express");
    const billRouter = billExpress.Router();
    var Bill = require("../models/Bill.ts");
    const { check,oneOf, validationResult } = require('express-validator');
    // #endregion
    
    // #region Validators deceleration
    const newbill = [
        check("bill_name", "bill_name is required")
        .not()
        .isEmpty().withMessage("bill_name must not be empty")
        .isLength({ min: 2,max:25 }).withMessage("bill_name long min is : 2 chars max is : 25 chars")
        // .isAlpha().withMessage("bill_name must be string"),
    ]
    
    const updatebill = oneOf(
        [
          [
          check("bill_name").exists() 
          .not()
          .isEmpty().withMessage("bill_name must not be empty")
          .isLength({ min: 2,max:25 }).withMessage("bill_name long min is : 2 chars max is : 25 chars")
          //  .isAlpha().withMessage("bill_name must be string")
         ]
    ]
    );
    // #endregion
    
    // #region Routes
    billRouter.post("/",async(req,res)=>{ // new Bill
        const errors = validationResult(req);
        try {
        if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),responseMsg:"Validation Error while add a new Bill",success:false
                });
            }
                const addedbill = await new Bill(req.body);
                await addedbill.save();
                return res.status(200).json({ message: "Bill added successfully" , success:true});
              } catch (err) {
                return res.status(400).json({err:err,msg:"Error occured while add a new Bill",success:false});
              }
            })
    billRouter.get("/",async(req,res)=>{ // get all bills
        try {
            const allbills = await Bill.find({}).populate('products')
            
            return res.status(200).json({response:allbills,success:true});
          } catch (err) {
            return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive all bills "});
          }
    })
    billRouter.get("/:id",async(req,res)=>{ // get one Bill by id
        try {
            const returnedBill = await Bill.find({ _id: req.params.id });
            return res.status(200).json({response:returnedBill,success:true});
          } catch (err) {
            return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive one Bill with id "});
          }    
    })
    billRouter.patch("/:id",updatebill,async(req,res)=>{ // edit one Bill
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),responseMsg:"Validation Error while update a Bill",success:false
                });
            }
         const result = await Bill.updateOne({_id:req.params.id},req.body)
            if(result){
                return res.status(200).json({responseMsg:"Bill changed successfully",success:true});
            }
        }catch(err){
            return res.status(200).json({responseMsg:"Bill changed unsuccessfully",success:false,response:err});
        }
    })
    billRouter.delete("/:id",async(req,res)=>{ // delete one Bill
        try{
            const result = await Bill.deleteOne({_id:req.params.id})
                 if(result){
                return res.status(200).json({responseMsg:"Bill deleted successfully",success:true});
                          }
        }catch(err){
            return res.status(200).json({responseMsg:"Bill deleted unsuccessfully",success:false,response:err});
        }
    })
    // #endregion
    module.exports = billRouter;
    })();
    