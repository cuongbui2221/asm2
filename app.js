const express = require('express')
const req = require('express/lib/request')
const { render } = require('express/lib/response')
const app = express()

//ket noi voi mogodb
const {MongoClient,ObjectId} = require('mongodb')
const DATABASE_URL = 'mongodb+srv://cuong:vclvcl123@cluster0.gk1vx.mongodb.net/test'
const DATABASE_NAME = 'MyFistDB'



app.set('view engine','hbs')
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/insert',(req,res)=>{
    res.render('product')
})

app.get('/view',async (req,res)=>{
    //lay du lieu tu Mongo
    const dbo = await getDatabase()
    const results = await dbo.collection("Products").find({}).limit(7).toArray()
    //hien thi du lieu qua HBS
    res.render('view',{products:results})
})

app.post('/product',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picInput = req.body.txtPic
    if(isNaN(priceInput)==true){
        const errorMessage = "Price must be a number!"
        res.render('product',{error:errorMessage})
        return;
    }
    const newP = {name:nameInput,price:Number.parseFloat(priceInput),picture:picInput}

    const dbo = await getDatabase()
    const result = await dbo.collection("Products").insertOne(newP)
    console.log("Gia tri id moi duoc insert la:", result.insertedId.toHexString())
    res.redirect('/')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')

async function getDatabase() {
    const client = await MongoClient.connect(DATABASE_URL)
    const dbo = client.db(DATABASE_NAME)
    return dbo
}
