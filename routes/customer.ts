(function () {
    // #region Variables deceleration
    const customerExpress = require("express");
    const customerRouter = customerExpress.Router();
    var Customer = require("../models/customer.ts");
    const { check,oneOf, validationResult } = require('express-validator');
    // #endregion
    
    // #region Validators deceleration
    const newCustomer = [
        check("customer_name", "customer_name is required")
        .not()
        .isEmpty().withMessage("customer_name must not be empty")
        .isLength({ min: 2,max:25 }).withMessage("customer_name long min is : 2 chars max is : 25 chars"),
        check("customer_phone", "customer_phone is required")
        .not()
        .isEmpty().withMessage("customer_phone must not be empty")
        .isLength({min:7, max:25}).withMessage("customer_phone long is min 7 max 15"),
        check("customer_address", "customer_address is required")
        .not()
        .isEmpty().withMessage("customer_address must not empty")
        .isLength({min:4, max:250}).withMessage("customer address long is min 4 max 250")
    ]
    
    const updateCustomer = oneOf(
        [
          [
          check("customer_name").exists() 
          .not()
          .isEmpty().withMessage("category_name must not be empty")
          .isLength({ min: 2,max:25 }).withMessage("customer_name long min is : 2 chars max is : 25 chars")
          //  .isAlpha().withMessage("category_name must be string")
         ]
    ]
    );
    // #endregion
    
    // #region Routes
    customerRouter.post("/", newCustomer, async(req, res)=>{ // new customer
        const errors = validationResult(req);
        try {
        if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(), responseMsg:"Validation Error while add a new customer",success:false
                });
            }
                const addedCustomer = await new Customer(req.body);
                await addedCustomer.save();
                return res.status(200).json({ message: "customer added successfully", success:true});
              } catch (err) {
                return res.status(400).json({err:err, msg:"Error occured while add a new customer", success:false});
              }
            })
    customerRouter.get("/", async(req,res)=>{ // get all customers
        try {
            const allCustomers = await Customer.find({});
            return res.status(200).json({response:allCustomers, success:true});
          } catch (err) {
            return res.status(400).json({response:err, success:false, responseMsg:"Error occured while retreive all categorys "});
          }
    })
    customerRouter.get("/:id", async(req,res)=>{ // get one customer by id
        try {
            const customer = await Customer.find({ _id: req.params.id });
            return res.status(200).json({response:customer, success:true});
          } catch (err) {
            return res.status(400).json({response:err, success:false, responseMsg:"Error occured while retreive one customer with id "});
          }    
    })
    customerRouter.post("/search", async(req,res)=>{
      //req.body.customerPhone
     try{
      const filteredCustomers = await Customer.find({"customer_phone" : {$regex:req.body.customerPhone}})
      return res.status(200).json({response:filteredCustomers, success:true});

     }
     catch(e){
      return res.status(400).json({response:e, success:false, responseMsg:"Error occured while retreive one customer with id "});
     } 

    })
    // #endregion
    module.exports = customerRouter;
    })();
    