(function () {
    // #region Variables deceleration
    const taxrateExpress = require("express");
    const taxrateRouter = taxrateExpress.Router();
    var Taxrate = require("../models/taxrate.ts");
    const { check, validationResult } = require('express-validator');
    // #endregion
    
    // #region Validators deceleration
    const newTaxrate = [
        check("tax_rate", "taxrate is required")
        .not()
        .isEmpty().withMessage("taxrate must not be empty")
        .isNumeric().withMessage('taxrate must be number')
        // .isAlpha().withMessage("category_name must be string"),
                      ]
    // #endregion
    
    // #region Routes
    taxrateRouter.post("/",newTaxrate,async(req,res)=>{ // new taxrate
        const errors = validationResult(req);
        try {
        if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),responseMsg:"Validation Error while add a new taxrate",success:false
                });
            }
                const addedTaxrate = await new Taxrate(req.body);
                await addedTaxrate.save();
                return res.status(200).json({ message: "taxrate added successfully" , success:true});
              } catch (err) {
                return res.status(400).json({err:err,msg:"Error occured while add a taxrate",success:false});
              }
            })
    taxrateRouter.get("/",async(req,res)=>{ // get all taxrates
        try {
            const allcategorys = await Taxrate.find({});
            return res.status(200).json({response:allcategorys,success:true});
          } catch (err) {
            return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive all taxrated "});
          }
    })
    taxrateRouter.get("/currentTaxRate",async(req,res)=>{ // get one category by id
        try {
            const currentTaxRate = await Taxrate.findOne().sort({"createdAt":-1}).limit(1)
            return res.status(200).json({response:currentTaxRate,success:true});
          } catch (err) {
              console.log(err)
            return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive current textrate "});
          }    
    })
    // #endregion
    module.exports = taxrateRouter;
    })();
    