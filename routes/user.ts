(function () {
    // #region Variables deceleration
    const userExpress = require("express");
    const userRouter = userExpress.Router();
    var User = require("../models/user.ts");
    const bcrypt = require("bcrypt");
    const { check, oneOf, validationResult } = require('express-validator');
    // #endregion
    
    // #region Validators deceleration
    const newUser = [
        check("username", "username is required")
        .not()
        .isEmpty().withMessage("user_name must not be empty")
        .isLength({ min: 2,max:25 }).withMessage("user_name long min is : 2 chars max is : 25 chars"),
        check("password", "password is required")
        .not()
        .isEmpty().withMessage("user_password must not be empty")
        .isLength({ min: 5,max:25 }).withMessage("user_password long min is : 5 chars max is : 25 chars"),
        check("role", "role is required")
        .not()
        .isEmpty().withMessage("user_role must not be empty")
        .isNumeric().withMessage('user_role must be number')
    ]
    
    const updateUser = oneOf(
        [
          [
          check("user_name").exists() 
          .not()
          .isEmpty().withMessage("user_name must not be empty")
          .isLength({ min: 2,max:25 }).withMessage("user_name long min is : 2 chars max is : 25 chars")
          //  .isAlpha().withMessage("category_name must be string")
         ]
    ]
    );
    // #endregion
    
    // #region Routes
    userRouter.post("/register", newUser, async(req, res)=>{ // new user
        const errors = validationResult(req);
        try {
        if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(), responseMsg:"Validation Error while add a new user",success:false
                });
            }
                const addedUser = await new User(req.body);
                // console.log(addedUser.password)
                const salt = await bcrypt.genSalt(20);
                addedUser.password = await bcrypt.hash(addedUser.password, salt);
                await addedUser.save();
                return res.status(200).json({ message: "user added successfully", success:true});
              } catch (err) {
                return res.status(400).json({err:err, msg:"Error occured while add a new user", success:false});
              }
            })
    userRouter.get("/", async(req,res)=>{ // get all Users
        try {
            const allCustomers = await User.find({});
            return res.status(200).json({response:allCustomers, success:true});
          } catch (err) {
            return res.status(400).json({response:err, success:false, responseMsg:"Error occured while retreive all categorys "});
          }
    })
    userRouter.get("/:id", async(req,res)=>{ // get one user by id
        try {
            const user = await User.find({ _id: req.params.id });
            return res.status(200).json({response: user, success: true});
          } catch (err) {
            return res.status(400).json({response:err, success:false, responseMsg:"Error occured while retreive one user with id "});
          }    
    })
    userRouter.patch("/:id",async(req,res)=>{ // edit one User
      try{
          const errors = validationResult(req);
          if (!errors.isEmpty()){
              return res.status(400).json({
                  errors: errors.array(),responseMsg:"Validation Error while update a user",success:false
              });
          }
       const result = await User.updateOne({_id:req.params.id},req.body)
          if(result){
              return res.status(200).json({responseMsg:"User changed successfully",success:true});
          }
      }catch(err){
          return res.status(200).json({responseMsg:"User changed unsuccessfully",success:false,response:err});
      }
  })
    
    // #endregion
    module.exports = userRouter;
    })();
    