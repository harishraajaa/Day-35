import { response } from 'express';
import { MongoClient } from 'mongodb'
import { v4 as genuuid } from 'uuid';
import 'dotenv/config'

//MongoDB - Connections
const url = process.env.db_url
const client = new MongoClient(url)
const db = client.db(process.env.db_name)

//Create Student
const createStudent=async(request,response)=>{

    try {
        await client.connect()
        console.log('Connected successfully to server')
        const collection = db.collection('students')
        let user=await collection.findOne({email:request.body.email})

        if(!user){
            request.body.id=genuuid()
            request.body.status=true
            await collection.insertOne(request.body)
            response.status(201 ).send({
                message:"Student Created!!!"
            })
        }
        else{
            response.status(400).send({
                message:"Student Data Already Exists!!!"
            })
        }

        
    } catch (error) {
        console.log("Error in createStudent Endpoint")
        response.status(500).send({
            message:"Internal Server Error",
            data:error.message
        })
    }
    finally{
        await client.close()
        console.log("Connection Closed")
    }
}

const getAllStudent=async(request,response)=>{

    try {
        await client.connect()
        console.log('Connected successfully to server')
        const collection = db.collection('students')

        let students= await collection.find().project({_id:0}).toArray()

        response.status(200).send({
            message:"Getting all Students Data",
            data:students
        })
        
    } catch (error) {
        console.log("Error in getAllStudent Endpoint")
        response.status(500).send({
            message:"Internal Server Error",
            data:error.message
        })
    }
    finally{
        await client.close()
        console.log("Connection Closed")
    }
}

export default {
    createStudent,
    getAllStudent
}
