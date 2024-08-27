import { response } from 'express';
import { MongoClient } from 'mongodb'
import { v4 as genuuid } from 'uuid';
import 'dotenv/config'

const url = process.env.db_url
const client = new MongoClient(url)
const db = client.db(process.env.db_name)
 
function generateRandomID(len){
    const text='qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
    let random=''
    for(let i=0;i<len;i++)
        random+=text[Math.floor(Math.random()*100)%62]
    return random
}

const getAllUser=async(request,response)=>{

    try {
        await client.connect()
        console.log('Connected successfully to server')
        const collection = db.collection('users')

        let users= await collection.find().project({_id:0}).toArray()

        response.status(200).send({
            message:"Get All Users",
            data:users
        })
        
    } catch (error) {
        console.log("Error in getAllUser Endpoint")
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

const getUserById=async(request,response)=>{

    try {
        await client.connect()
        console.log('Connected successfully to server')
        const db = client.db(process.env.db_name)
        const collection = db.collection('users')
        let {id}=request.params
        console.log(id)
        let user= await collection.findOne({id:id})

        response.status(200).send({
            message:"Get User",
            data:user
        })
        
    } catch (error) {
        console.log("Error in getAllUser Endpoint")
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

const createUser=async(request,response)=>{

    try {
        await client.connect()
        console.log('Connected successfully to server')
        const collection = db.collection('users')
        let user=await collection.findOne({email:request.body.email})

        if(!user){
            request.body.id=genuuid()
            request.body.status=true
            await collection.insertOne(request.body)
            response.status(201 ).send({
                message:"User Created!!!"
            })
        }
        else{
            response.status(400).send({
                message:"User Already Exists!!!"
            })
        }

        
    } catch (error) {
        console.log("Error in createUser Endpoint")
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

const editUserById = async (request, response) => {
    
    try {
        await client.connect()
        console.log('Connected successfully to server')
        const collection = db.collection('users')
        let {id}= request.params
        let user = await collection.findOne({id:id})
        if(user)
        {
            await collection.updateOne({id:id},{$set:{...user,...request.body}})
            response.status(200).send({message:"Data Saved Successfully"})
        }
        else
            response.status(400).send({message:"Invalid Id"})

        
    } catch (error) {
        console.log("Error in EditUserById Endpoint")
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

const deleteUserById = async (request, response) => {

    try {
        await client.connect()
        console.log('Connected successfully to server')
        const collection = db.collection('users')
    
        let {id} = request.params
        let data = await collection.deleteOne({id:id})
        if(data.deletedCount)
            response.status(200).send({message:"User Deleted Successfully"})
        else
            response.status(400).send({message:"Invalid Id"})
        
    } catch (error) {
        console.log("Error in deleteUserById Endpoint")
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

export default {getAllUser,createUser,getUserById,editUserById,deleteUserById}