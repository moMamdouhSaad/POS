(function () {
    // #region Variables deceleration
    const tableExpress = require("express");
    const tableRouter = tableExpress.Router();
    var Table = require("../models/table.ts");
    const { check,oneOf, validationResult } = require('express-validator');
    // #endregion

    // #region Validators deceleration
    const updateTableStatus =  [
      check("table_status", "table_status is required")
      .not()
      .isEmpty().withMessage("category_name must not be empty")
                               ]
  // #endregion
    
  // #region Routes
    tableRouter.post("/",async(req,res)=>{ // new table
        const errors = validationResult(req);
        try {
                console.log(req.body)
                for(var i = 0; req.body.tablesAdded > i ; i++){
                  const addedTable = await new Table(req.body);
                  await addedTable.save();
                }
                return res.status(200).json({ message: "tables added successfully" , success:true});
              } catch (err) {
                return res.status(400).json({err:err,msg:"Error occured while add a new table",success:false});
              }
            })


    tableRouter.get("/",async(req,res)=>{ // get all tables
                try {
                    const allTables = await Table.find({});
                    return res.status(200).json({response:allTables,success:true});
                  } catch (err) {
                    return res.status(400).json({response:err,success:false,responseMsg:"Error occured while retreive all tables "});
                  }
            })
    tableRouter.delete("/:id",async(req,res)=>{ // delete one table
              try{
              const result = await Table.deleteOne({_id:req.params.id})
              if(result){
              return res.status(200).json({responseMsg:"Table deleted successfully",success:true});
                        }
              }catch(err){
                  return res.status(200).json({responseMsg:"Product deleted unsuccessfully",success:false,response:err});
              }
            })   
    tableRouter.patch("/status/:id",updateTableStatus,async(req,res)=>{ // edit table status
              try{
                  const errors = validationResult(req);
                  if (!errors.isEmpty()){
                      return res.status(400).json({
                          errors: errors.array(),responseMsg:"Validation Error while update a Table status",success:false
                      });
                  }
               const result = await Table.updateOne({_id:req.params.id},{table_status:req.body.table_status},{runValidators:true})
                  if(result){
                      return res.status(200).json({responseMsg:"Table Status changed successfully",success:true});
                  }
              }catch(err){
                  return res.status(200).json({responseMsg:"Table Status changed unsuccessfully",success:false,response:err});
              }
            })        
    // #endregion
    module.exports = tableRouter;
    })();
    