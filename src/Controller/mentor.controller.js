import { response } from 'express';
import { MongoClient } from 'mongodb'
import { v4 as genuuid } from 'uuid';
import 'dotenv/config'

//MongoDB - Connections
const url = process.env.db_url
const client = new MongoClient(url)
const db = client.db(process.env.db_name)

//
function findIndexById(array,id)
{
    for (let i=0;i<array[0].studentid.length;i++)
    {
        if(array[0].studentid[i]==id)
            return i
    }
    return -1

}
//
const studentmentorQuery = [
    {
        $lookup:{
            from:"students",
            localField:"id",
            foreignField:"mentorid",
            as:"result"
        }
    }
]
//Create Mentor
const createMentor=async(request,response)=>{

    try {
        await client.connect()
        console.log('Connected successfully to server')
        const collection = db.collection('mentors')
        let user=await collection.findOne({email:request.body.email})

        if(!user){
            request.body.id=genuuid()
            request.body.status=true
            await collection.insertOne(request.body)
            response.status(201 ).send({
                message:"Mentor Created!!!"
            })
        }
        else{
            response.status(400).send({
                message:"Mentor Data Already Exists!!!"
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

const getAllMentors=async(request,response)=>{

    try {
        await client.connect()
        console.log('Connected successfully to server')
        const collection = db.collection('mentors')

        let mentors= await collection.find().project({_id:0}).toArray()

        response.status(200).send({
            message:"Getting all Mentors Data",
            data:mentors
        })
        
    } catch (error) {
        console.log("Error in getAllMentors Endpoint")
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

const assignMentor=async(request,response)=>{

    try {

        let {mid,sid}=request.params
        await client.connect()
        console.log('Connected successfully to server')
        const mencol = db.collection('mentors')
        const stucol=db.collection('students')

        let mentor=await mencol.findOne({id:mid})
        let student=await stucol.findOne({id:sid})


        if (mentor && student)
        {
            if(student.mentorid==='')
                {
                await stucol.updateOne({id:sid},{$set:{mentorid:mid}})
                await mencol.updateOne({id:mid},{$push:{studentid:sid}})
                response.status(201).send({
                    message:"Assignment Completed",
                })
                }
                else{
                    response.status(400).send({
                        message:"Student is already assigned to a Mentor",
                    })
                }
        }
        else{
            response.status(500).send({
                message:"Invalid Student or Mentor Id",
            })
        }
        
    } catch (error) {
        console.log("Error in assignMentor Endpoint")
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

const getMentorById=async(request,response)=>{

    try {

        let {id}=request.params
        console.log(id)
        await client.connect()
        console.log('Connected successfully to server')
        const mencol = db.collection('mentors')
        //const stucol=db.collection('students')

        let mentor= await mencol.findOne({id:id})

        if(mentor)
        {
            let result= await mencol.aggregate([...studentmentorQuery,{$match:{id:id}}]).toArray()
            response.status(200).send({
                message:"Try Block",
                data:result
            })
        }
        else{
            response.status(400).send({
                message:"Invalid Mentor Id"
            })
        }

        
    } catch (error) {
        console.log("Error in getMentorById Endpoint")
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

const assignChangeMentor=async(request,response)=>{

    try {

        let {sid,newmid}=request.params
        await client.connect()
        console.log('Connected successfully to server')
        const mencol = db.collection('mentors')
        const stucol=db.collection('students')
        //
        let mentor=await mencol.findOne({id:newmid})
        let student=await stucol.findOne({id:sid})

        if (mentor && student) {
            if (student.mentorid === '') {
                await stucol.updateOne({ id: sid }, { $set: { mentorid: mid } })
                await mencol.updateOne({ id: mid }, { $push: { studentid: sid } })
                response.status(201).send({
                    message: "New Assignment Completed",
                })
            }
            else {
                //1.Remove Sid from Old Mentor
                let oldid=await stucol.find({id:sid}).project({_id:0,mentorid:1}).toArray()
                let {mentorid}=oldid[0]
                //Finding the Index, remove the Sid
                let studentList= await mencol.find({id:mentorid}).project({_id:0,studentid:1}).toArray()
                let index=findIndexById(studentList,sid)
                studentList[0].studentid.splice(index,1)
                await mencol.updateOne({id:mentorid},{$set:{studentid:studentList[0].studentid}})
                //2.Add Sid to New Mentor
                await stucol.updateOne({ id: sid }, { $set: { mentorid: newmid } })
                await mencol.updateOne({ id: newmid }, { $push: { studentid: sid } })
                response.status(400).send({
                    message: "Re-Assignment Completed",
                })
            }
        }
        else{
            response.status(400).send({
                message:"Invalid Student/Mentor Id"
            })
        }
        
    } catch (error) {
        console.log("Error in assignMentor Endpoint")
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
    createMentor, getAllMentors, assignMentor, getMentorById, assignChangeMentor
}
