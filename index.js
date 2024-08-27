import express from 'express'
import appRoutes from './src/Router/index.router.js'
import 'dotenv/config'

const PORT = process.env.PORT
const app=express()

app.use(express.json())

app.use(appRoutes)
app.get("/", (req, res) => {
    res.send("<div style='text-align:center><h2>Student & Mentor Assigning using MongoDB Database</h2></div>");
  });

app.listen(PORT,()=>console.log(`Server is up and running on Port: ${PORT}`))