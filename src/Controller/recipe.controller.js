import { MongoClient } from "mongodb"
import { v4 as uuid } from "uuid"
import 'dotenv/config'

const client = new MongoClient(process.env.db_url)
const dbName = process.env.db_name

const recipeUserQuery = [
    {
        $lookup:{
            from:'users',
            localField:"userid",
            foreignField:"id",
            as:"recipeUser"
        }
    },
    {$unwind:"$recipeUser"},
    {$project:{name:1,description:1,ingedrients:1,procedure:1,userid:1,id:1,author:"$recipeUser.name",email:"$recipeUser.email"}}
]

const getAllRecipes = async(req,res)=>{
    try {
        await client.connect()
        const recipeCollection = client.db(dbName).collection('recipes')
        let recipes = await recipeCollection.aggregate(recipeUserQuery).toArray()
        res.status(200).send({
            message:"Data Fetch Successfull",
            data:recipes
        })
        
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
    finally {
        client.close()
    }
}

const getAllRecipesByUserId = async(req,res)=>{
    try {
        await client.connect()
        const recipeCollection = client.db(dbName).collection('recipes')
        const {id} = req.params
        let recipes = await recipeCollection.aggregate([...recipeUserQuery,{$match:{userid:id}}]).toArray()
        res.status(200).send({
            message:"Data Fetch Successfull",
            data:recipes
        })
        
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
    finally {
        client.close()
    }
}

const createRecipe = async(req,res)=>{
    try {
        await client.connect()
        const userCollection = client.db(dbName).collection('users')
        const recipeCollection = client.db(dbName).collection('recipes')
        let user = await userCollection.findOne({id:req.body.userid})
        if(user)
        {
            req.body.id = uuid()
            await recipeCollection.insertOne(req.body)
            res.status(201).send({
                message: "Recipe Added Successfully"
            })
        }
        else
        {
            res.status(400).send({message:`Invalid userId`})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
    finally {
        client.close()
    }
}
export default {
    createRecipe,
    getAllRecipes,
    getAllRecipesByUserId
}