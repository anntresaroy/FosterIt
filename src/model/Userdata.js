const mongoose = require('mongoose');
var bcrypt = require('bcrypt')
// mongoose.connect('mongodb+srv://userone:<password>@cluster0.6ragu.mongodb.net/test');
const uri="mongodb+srv://userone:userone@cluster0.6ragu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("db connected1")
})
const schema = mongoose.Schema;

const UserSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        required:true
    }
});


UserSchema.statics.hashPassword = function hashPassword (password){
    return bcrypt.hashSync(password , 12)
}

UserSchema.methods.isValid = function(hashedpassword){
    return bcrypt.compareSync(hashedpassword , this.password)
}



var userData = mongoose.model('userData',UserSchema);
module.exports = userData;
/*const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:anntresaroy20@cluster0.6ragu.mongodb.net/LibraryDb?retryWrites=true&w=majority');
const schema = mongoose.Schema;

const UserSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }
});

var userData = mongoose.model('userData',UserSchema);

module.exports = userData;*/