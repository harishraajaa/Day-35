import express from "express"
import mentorrouter from "./mentor.router.js"
import studentrouter from './student.router.js'

 
const router=express.Router()
router.get("/", (req, res) => {
    res.send(`<div style='text-align:center'><h2>Student & Mentor Assigning using MongoDB Database</h2></div>`)
  })
router.use('/students',studentrouter)
router.use('/mentors',mentorrouter)
router.get('/*',(request,response)=>response.send(`<div style='text-align:center'><h1>404 Endpoint Not found</h1></div`))

export default router