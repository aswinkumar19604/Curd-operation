const mongodp=require('mongodb');
//const { ObjectId } = require('mongodb')
const MongoClient=mongodp.MongoClient;
const ObjectId =mongodp.ObjectId;

let database;
async function getdatabase(){
    const client= await MongoClient.connect('mongodb://localhost:27017')
    database=client.db('library');
    if(!database){
        console.log('database not connected')
    }
    return database;
}
module.exports={
    getdatabase,
    ObjectId
}