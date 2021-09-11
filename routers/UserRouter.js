import express from 'express'
const Router = express.Router()
import { createUser } from '../models/user-model/User.model.js'
import { createAdminUserValidation } from '../middlewares/formValidation.middleware.js'
import { hashPassword } from '../helpers/bcrypt.helper.js'

Router.all("/", (req, res, next) => {
    console.log("FROM USER ROUTER")

    next()
})

Router.post("/", createAdminUserValidation ,async (req, res) => {
    console.log(req.body)

    try {
            // To Do
        // server side validation

        // encrypt password
        const hashPass = hashPassword(req.body.password)
        
        if (hashPass) {
            
            req.body.password = hashPass
            console.log(hashPass)

        const result= await createUser(req.body)

        if (result?._id) {

            //To DO
            //create unique activation link and email teh link to user email


          return  res.json({
                state: "success",
                message: "NEW USER HAS BEEN CREATED SUCCESSFULLY. We have sent an email confirmation to your email, please check and follwo the instruction to activate your account."
            })
        }
        res.json({
            state: "error",
            message: "UNABLE TO CREATE NEW USER"
            }) }
    } catch (error) {
        let msg="Error, Unable to create new user."
        console.log(error.message)
        if (error.message.includes("E11000 duplicate key error collection")) {
            msg="This email has been used by another user."
        }
        res.json({
            state: "error",
            message: "msg"
        })
        
    }
})
export default Router