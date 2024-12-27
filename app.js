const express=require('express');
const app=express()
const body=require('body-parser')
const exhbs=require('express-handlebars')
const dbo=require('./db');
const ObjectId=dbo.ObjectId;
const bodyParser = require('body-parser');
app.engine('hbs',exhbs.engine({layoutsDir:"views/",defaultLayout:"main",extname:"hbs"}))
app.set('view engine','hbs')
app.set('views','views')
app.use(bodyParser.urlencoded())
app.get('/',async (req,res)=>{
    let database= await dbo.getdatabase();
    const collection=database.collection('books');
    const cursor=collection.find({})
    let books=await cursor.toArray();
    let message='';
    let edit_id,edit_book;
    if(req.query.edit_id){
        edit_id=req.query.edit_id;
        edit_book= await collection.findOne({_id:new ObjectId(edit_id)})
    }
    if(req.query.delete_id){
        await collection.deleteOne({_id:new ObjectId(req.query.delete_id)})
        return res.redirect('/?status=3')


    }

    switch(req.query.status){
        case'1':
        message='inserted seccessfully'
        break;
        case'2':
        message='updated seccessfully'
        break;
        case'3':
        message='deleted seccessfully'
        break;
        default:
            break;
    }
    res.render('main',{message,books,edit_id,edit_book})
})
app.post('/store-book',async (req,res)=>{
    let database=await dbo.getdatabase();
    const collection=database.collection('books');
    let book={ title: req.body.title,author:req.body.author}
    await collection.insertOne(book)
    return res.redirect('/?status=1')


})
app.post('/update_book/:edit_id',async (req,res)=>{
    let database=await dbo.getdatabase();
    const collection=database.collection('books');
    let book={ title: req.body.title,author:req.body.author}
    let edit_id=req.params.edit_id;
    await collection.updateOne({_id: new ObjectId(edit_id)},{$set:book})
    return res.redirect('/?status=2')


})
app.listen(8000,()=>{console.log('listening to 8000 port')})