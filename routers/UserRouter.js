import express from 'express'
const Router = express.Router()
import { createUser } from '../models/user-model/User.model.js'

Router.all("/", (req, res, next) => {
    console.log("FROM USER ROUTER")

    next()
})

Router.post("/", async (req, res) => {
    try {
        const result= await createUser(req.body)

        if (result?._id) {
            res.json({
                state: "success",
                message: "NEW USER HAS BEEN CREATED SUCCESSFULLY."
            })
        }
        res.json({
            state: "error",
            message: "UNABLE TO CREATE NEW USER"
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            state: "error",
            message: "Error"
        })
        
    }
})
export default Router