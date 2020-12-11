const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        inique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

})
userSchema.pre('save', function (next) {
    //비밀번호를 암호화 시킨다
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }

})

userSchema.methods.comparePassword = function (plainPassword, cb) {
   
    //plainPassword 12345678   암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err){return cb(err)}
        console.log('여기는 오는가')
        cb(null, isMatch)
    })
}



userSchema.methods.generateToken = function (cb) {
    // 제이슨 웹토큰을 이용해서 토큰생성
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'token')
    
    user.token = token


    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)

    })

}

userSchema.statics.findByToken = function(token,cb){
    console.log("바인드토큰 확인")
    var user =this;
    //토큰을 decode 한다.
    jwt.verify(token,'token',function(err,decoded){
    
            user.findOne({"_id":decoded,"token":token},function (err,user){
                    if(err){return cb(err);}
                    cb(null,user)

            })

    })


}


const User = mongoose.model('User', userSchema);

module.exports = { User }