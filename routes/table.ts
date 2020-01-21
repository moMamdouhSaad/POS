(function () {
    // #region Variables deceleration
    const tableExpress = require("express");
    const tableRouter = tableExpress.Router();
    var Table = require("../models/table.ts");
    const { check,oneOf, validationResult } = require('express-validator');
    // #endregion
    
    // #region Routes
    tableRouter.post("/",async(req,res)=>{ // new table
        const errors = validationResult(req);
        try {
                const addedTable = await new Table(req.body);
                await addedTable.save();
                return res.status(200).json({ message: "table added successfully" , success:true});
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

    // #endregion
    module.exports = tableRouter;
    })();
    