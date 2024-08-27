import express from "express"
import MentorController from "../Controller/mentor.controller.js"
import mentorController from "../Controller/mentor.controller.js"
const mentorrouter=express.Router()

//studentrouter.get('/',(request,response)=>response.send({message:"user Data Fetched"}))
mentorrouter.get('/getAllMentors',MentorController.getAllMentors)
mentorrouter.get('/getMentorById/:id',MentorController.getMentorById)
mentorrouter.post('/createMentor',MentorController.createMentor)
mentorrouter.put('/assignChangeMentor/:sid/:newmid',MentorController.assignChangeMentor)
mentorrouter.put('/assignMentor/:mid/:sid',MentorController.assignMentor)

export default mentorrouter