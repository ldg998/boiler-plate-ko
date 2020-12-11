const express = require('express');
const app = express();
const port = 5000
const { User } = require("./modals/User");
const bodyParser = require('body-parser');
const config = require("./config/key");
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

//application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
const mongoose = require('mongoose')
//mongodb+srv://donggun:<password>@cluster0.7itkq.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongodb+srv://donggun:<password>@cluster0.lnurr.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongodb connected..'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('안녕하세요호호호호!')
})

app.post('/register', (req, res) => {
  // 회원가입 할때 필요한 정보들을 클라이언트에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ sucess: false, err })
    return res.status(200).json({
      sucess: true
    })
  })
})




app.post('/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 확인
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당된 유저가 없습니다"
      })
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        console.log('비밀번호 아웃')
        return res.json({
          loginSuccess: false, message: "비밀번호가 틀렸습니다."
        })
      }
      user.generateToken((err, user) => {
        console.log('토큰작업 시작')
        if (err) return res.status(400).send(err);
        //토큰을 저장한다. 어디에 ?
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  console.log("유저어스 확인")
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user_email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image

  })

})

app.get('/api/users/logout', auth, (req, res) => {
  
  User.findOneAndUpdate({ _id: req.user._id }, 
    { token: "" },
     (err, user) => {
    if (err) return res.json({ success: false, err });

    return res.status(200), send({
      success: true
    })
  })

})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})