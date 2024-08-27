import express from "express"
import StudentController from "../Controller/student.controller.js"
const studentrouter=express.Router()

//studentrouter.get('/',(request,response)=>response.send({message:"user Data Fetched"}))
studentrouter.get('/getAllStudents',StudentController.getAllStudent)
//studentrouter.get('/getStudentById/:id',StudentController.getUserById)
studentrouter.post('/createStudent',StudentController.createStudent)
//studentrouter.delete('/deleteUserById/:id',userController.deleteUserById)
//studentrouter.put('/editStudentById/:id',StudentController.editUserById)

export default studentrouter