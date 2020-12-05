const express = require('express')
const app = express()
const port = 5000
const {User} = require("./modals/User");
const bodyParser = require('body-parser');

const config = require ("./config/key")

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
//mongodb+srv://donggun:<password>@cluster0.7itkq.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongodb+srv://donggun:<password>@cluster0.lnurr.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(config.mongoURI,{
  useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('mongodb connected..'))
.catch(err=>console.log(err))



app.get('/', (req, res) => {
  res.send('안녕하세요호호호호!')
})

app.post('/register',(req,res) =>{
 // 회원가입 할때 필요한 정보들을 클라이언트에서 가져오면
 // 그것들을 데이터 베이스에 넣어준다.
   const user = new User(req.body);


   user.save((err,userInfo)=>{
if(err) return res.json({sucess: false,err})
      return res.status(200).json({
     sucess:true
     })
   })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})