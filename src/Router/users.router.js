import express from "express"
import userController from "../Controller/user.controller.js"
const userrouter=express.Router()

userrouter.get('/',(request,response)=>response.send({message:"user Data Fetched"}))
userrouter.get('/getAllUsers',userController.getAllUser)
userrouter.get('/getUserById/:id',userController.getUserById)
userrouter.post('/createUser',userController.createUser)
userrouter.delete('/deleteUserById/:id',userController.deleteUserById)
userrouter.put('/editUserById/:id',userController.editUserById)

export default userrouter