(function () {
    // #region Variables deceleration
    const billExpress = require("express");
    const billRouter = billExpress.Router();
    var Bill = require("../models/Bill.ts");
    var Table = require("../models/table.ts");
    const { check,oneOf, validationResult } = require('express-validator');
    // #endregion
    
    // #region Validators deceleration
    const newbill = [
        check("bill_type", "bill_type is required")
        .not()
        .isEmpty().withMessage("bill_type must not be empty")
        .isLength({ min: 2,max:25 }).withMessage("bill_type long min is : 2 chars max is : 25 chars"),
        check("lines").not()
        .isEmpty().withMessage("lines must not be empty"),
        check("subtotal", "subtotal is required")
        .not()
        .isEmpty().withMessage("subtotal must not be empty")
        .isNumeric().withMessage("subtotal must be numbers")
        .isLength({ min: 1,max:25 }).withMessage("subtotal long min is : 1 chars max is : 25 chars"),
        check("total", "total is required")
        .not()
        .isEmpty().withMessage("total must not be empty")
        .isNumeric().withMessage("total must be numbers")
        .isLength({ min: 1,max:25 }).withMessage("total long min is : 1 chars max is : 25 chars"),
        check("tax_rate", "tax_rate is required")
        .not()
        .isEmpty().withMessage("tax_rate must not be empty")
        .isNumeric().withMessage("tax_rate must be numbers")
        .isLength({ min: 1,max:3 }).withMessage("tax_rate long min is : 1 chars max is : 3 chars"),
        // .isAlpha().withMessage("bill_name must be string"),
    ]
    
    const updatebill = oneOf(
        [
          [
          check("bill_name").exists() 
          .not()
          .isEmpty().withMessage("bill_name must not be empty")
          .isLength({ min: 2,max:25 }).withMessage("bill_name long min is : 2 chars max is : 25 chars"),
          //  .isAlpha().withMessage("bill_name must be string")
         ]
    ]
    );
    // #endregion
    
    // #region Routes
    billRouter.post("/",newbill,async(req,res)=>{ // new Bill
        const errors = validationResult(req);
        try {
        if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),responseMsg:"Validation Error while add a new Bill",success:false
                });
            }
                

                const table_number = req.body.table_number;
               console.log(req.body.bill_status)
                const returnedBill = await Bill.findOne({ table_number:table_number,bill_status:"Stored" }) //TODO : optimization
                //Cashed
                //Stored
                let table_status;
                switch(req.body.bill_status){
                    case 'Cashed':
                     table_status = "Closed"   
                    break;
                    case 'Stored':
                     table_status = "Opened"
                    break;
                }
                await Table.updateOne({table_number:table_number},{table_status:table_status})
                if(returnedBill){
                 await Bill.updateOne({_id:returnedBill._id},req.body)    
                                 }
                    else{
                    var addedbill = await new Bill(req.body);
                    await addedbill.save();
                    }

                return res.status(200).json({ message: "Bill added successfully" , success:true});
              } catch (err) {
                  console.log(err)
                return res.status(400).json({err:err,msg:"Error occured while add a new Bill",success:false});
              }
            })
    billRouter.get("/",async(req,res)=>{ // get all bills
        try {
            const allbills = await Bill.find({}).populate('lines.product')
            
            return res.status(200).json({response:allbills,success:true});
          } catch (err) {
            return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive all bills "});
          }
    })
    billRouter.get("/:table_no",async(req,res)=>{ // get one Bill by id
        try {
            const returnedBill = await Bill.findOne({ table_number: req.params.table_no,bill_status:"Stored" }).populate('lines.product')
            return res.status(200).json({response:returnedBill,success:true});
          } catch (err) {
            return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive one Bill with id "});
          }    
    })
    billRouter.patch("/:id",newbill,async(req,res)=>{ // edit one Bill
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
    