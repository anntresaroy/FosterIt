const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3001;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var app = new express();
const Bookdata = require('./src/model/Bookdata');
const Authordata = require('./src/model/Authordata');
app.use(cors());
var bodyparser = require('body-parser');
const userData = require('./src/model/Userdata');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secret')
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    next()
}

// User Registration Begis Here

app.post('/signup', async(req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var newUser = {
        name: req.body.name,
        email: req.body.email,
        password: userData.hashPassword(req.body.password),
        phone: req.body.phone,
        role: req.body.role
    }

    var item = userData(newUser);
    await item.save((err, doc) => {
        if (!err) {
            console.log("Success");
            res.send(doc);
        } else {
            if (err.code == 11000) {
                console.log(err);
                res.status(422).send("Email address already exist");
            } else {
                console.log(err);
            }
        }
    });
});


// User Registration Ends Here

app.get('/users', (req, res) => {
    userData.find()
        .then(function(users) {
            res.send(users);
        });
});

app.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.send('Backend Successfull');
});

app.post('/login', function(req, res, next) {
    console.log(req.body);
    var user = {
        email: req.body.email,
        password: req.body.password
    }

    // let userValidate = await userData.findOne({'email':user.email});
    // console.log(userValidate);

    // if(!userValidate){
    //     console.log("Failed at email verification");
    //     res.status(401).send('Invalid Username or Password');
    // }
    // else{
    //     const isMatch = await bcrypt.compare(user.password,userValidate.password);
    //     if(!isMatch){
    //         console.log('Failed at password verification');
    //         res.status(401).send('Invalid Username or Password');
    //     }
    //     else{
    //         let payload = {subject:userValidate.email+userValidate.password}
    //         let token = jwt.sign(payload,'secretKey');
    //         console.log("Success");
    //         res.status(200).send({token});
    //     }
    // }




    let promise = userData.findOne({ email: user.email })
    promise.then(function(doc) {
        if (doc) {
            if (doc.isValid(user.password)) {
                let token = jwt.sign({ id: doc._id }, 'secret')
                res.status(200).json(token);


            } else {
                let abc = "Invalid password"
                res.json(abc);
            }
        } else {
            let a = "user not reg"
            res.json(a)
        }
    })


});





//Book Activities Starts Here

app.get('/books', verifyToken, (req, res) => {
    Bookdata.find()
        .then(function(books) {
            res.send(books);
        });
})

app.post('/add_book', verifyToken, (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    var newbook = {
        title: req.body.book.title,
        author: req.body.book.author,
        genre: req.body.book.genre,
        description: req.body.book.description,
        image: req.body.book.image
    }
    console.log(newbook);
    var item = new Bookdata(newbook);
    item.save();
});

app.get('/books/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    Bookdata.findOne({ '_id': id })
        .then((book) => {
            res.send(book);
        });
});

app.put('/update_book', verifyToken, (req, res) => {
    console.log(req.body);
    // id=req.body._id,
    // title: req.body.book.title,
    // author: req.body.book.author,
    // genre: req.body.book.genre,
    // description: req.body.book.description,
    // image: req.body.book.image
    // bookData.findByIdAndUpdate({'_id':id},
    //                             {$set:{'title':title,
    //                                     'author':author,
    //                                     'genre':genre,
    //                                     'description':description,
    //                                     'image':image}});
    // .then(functiion(){
    //     res.send();
    // });
    var newbook = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        image: req.body.image
    }
    id = req.body._id;
    Bookdata.findByIdAndUpdate({ '_id': id }, {
            $set: {
                'title': newbook.title,
                'author': newbook.author,
                'genre': newbook.genre,
                'description': newbook.description,
                'image': newbook.image
            }
        })
        .then(function() {
            res.send();
        });
});

app.delete('/delete_book/:id', verifyToken, (req, res) => {
    id = req.params.id;
    Bookdata.findByIdAndDelete({ '_id': id })
        .then(function() {
            console.log('Pet Deleted');
            res.send();
        });
})

//Book Activities Ends Here

//Author Activities Starts Here

app.get('/authors', verifyToken, (req, res) => {
    Authordata.find()
        .then(function(authors) {
            res.send(authors);
        });
});

app.get('/authors/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    Authordata.findOne({ '_id': id })
        .then((author) => {
            res.send(author);
        });
});

app.post('/add_author', verifyToken, (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    var newauthor = {
        name: req.body.author.name,
        description: req.body.author.description,
        image: req.body.author.image
    }
    console.log(newauthor);
    var item = Authordata(newauthor);
    item.save();
});

app.put('/update_author', verifyToken, (req, res) => {
    console.log(req.body);
    var newauthor = {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    }
    id = req.body._id;
    Authordata.findByIdAndUpdate({ '_id': id }, {
            $set: {
                'name': newauthor.name,
                'description': newauthor.description,
                'image': newauthor.image
            }
        })
        .then(function() {
            res.send();
        });
});

app.delete('/delete_author/:id', verifyToken, (req, res) => {
    id = req.params.id;
    Authordata.findByIdAndDelete({ '_id': id })
        .then(function() {
            console.log('Pet Deleted');
            res.send();
        });
})

app.get('/username', verifyToken2, function(req, res, next) {
    return res.status(200).json(decodedToken.id);
})


var decodedToken = '';

function verifyToken2(req, res, next) {
    let token = req.query.token;

    jwt.verify(token, 'secret', function(err, tokendata) {
        if (err) {
            return res.json({ message: ' Unauthorized request' });
        }
        if (tokendata) {
            decodedToken = tokendata;
            next();
        }
    })
}


app.get("/role/:id", function(req, res) {
    let id = req.params.id


    userData.find({ _id: id }).select('role') // selects all the id which is not equal to the given id
        .then(function(data) {

            if (data) {

                res.json(data);
            } else {
                res.json({ id: "null", name: "NO SUCH USER REGISTERED" })
            }

        });

});

//Author Activities Ends Here

//Port Configuration

app.listen(port, () => { console.log("Listening at port" + port) });


/*const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3001;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var app = new express();
const Bookdata = require('./src/model/Bookdata');
const Authordata = require('./src/model/Authordata');
app.use(cors());
var bodyparser = require('body-parser');
const userData = require('./src/model/Userdata');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secret')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

// User Registration Begis Here

app.post('/signup',async (req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    }
    hashedPsw = await bcrypt.hash(newUser.password,12);
    newUser.password = await hashedPsw;
    var item = userData(newUser);
    await item.save((err,doc)=>{
        if(!err){
            console.log("Success");
            res.send(doc);
        }
        else{
            if(err.code ==11000){
                console.log(err);
                res.status(422).send("Email address already exist");
            }
                
            else{
                console.log(err);
            }
        }
    });
});


// User Registration Ends Here

app.get('/users',(req,res)=>{
    userData.find()
    .then(function(users){
        res.send(users);
    });
});

app.get('/',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.send('Backend Successfull');
});

app.post('/login',async (req,res)=>{
    console.log(req.body);
    var user = {
        email:req.body.email,
        password:req.body.password
    }

    let userValidate = await userData.findOne({'email':user.email});
    console.log(userValidate);
    
    if(!userValidate){
        console.log("Failed at email verification");
        res.status(401).send('Invalid Username or Password');
    }
    else{
        const isMatch = await bcrypt.compare(user.password,userValidate.password);
        if(!isMatch){
            console.log('Failed at password verification');
            res.status(401).send('Invalid Username or Password');
        }
        else{
            let payload = {subject:userValidate.email+userValidate.password}
            let token = jwt.sign(payload,'secretKey');
            console.log("Success");
            res.status(200).send({token});
        }
    }
});

//Book Activities Starts Here

app.get('/books',verifyToken,(req,res)=>{
    Bookdata.find()
    .then(function(books){
        res.send(books);
    });
})

app.post('/add_book',verifyToken, (req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    var newbook = {
        title: req.body.book.title,
        author: req.body.book.author,
        genre: req.body.book.genre,
        description: req.body.book.description,
        image: req.body.book.image
    }
    console.log(newbook);
    var item = new Bookdata(newbook);
    item.save();
});

app.get('/books/:id',verifyToken,(req,res)=>{
    const id = req.params.id;
    Bookdata.findOne({'_id':id})
    .then((book)=>{
        res.send(book);
    });
});

app.put('/update_book',verifyToken,(req,res)=>{
    console.log(req.body);
    // id=req.body._id,
    // title: req.body.book.title,
    // author: req.body.book.author,
    // genre: req.body.book.genre,
    // description: req.body.book.description,
    // image: req.body.book.image
    // bookData.findByIdAndUpdate({'_id':id},
    //                             {$set:{'title':title,
    //                                     'author':author,
    //                                     'genre':genre,
    //                                     'description':description,
    //                                     'image':image}});
    // .then(functiion(){
    //     res.send();
    // });
    var newbook = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        image: req.body.image
    }
    id = req.body._id;
    Bookdata.findByIdAndUpdate({'_id':id},
                                {$set:{'title':newbook.title,
                                    'author':newbook.author,
                                    'genre':newbook.genre,
                                    'description':newbook.description,
                                    'image':newbook.image}})
    .then(function(){
        res.send();
    });
});

app.delete('/delete_book/:id',verifyToken,(req,res)=>{
    id=req.params.id;
    Bookdata.findByIdAndDelete({'_id':id})
    .then(function(){
        console.log('Book Deleted');
        res.send();
    });
})

//Book Activities Ends Here

//Author Activities Starts Here

app.get('/authors',verifyToken,(req,res)=>{
    Authordata.find()
    .then(function(authors){
        res.send(authors);
    });
});

app.get('/authors/:id',verifyToken,(req,res)=>{
    const id = req.params.id;
    Authordata.findOne({'_id':id})
    .then((author)=>{
        res.send(author);
    });
});

app.post('/add_author',verifyToken,(req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    var newauthor = {
        name: req.body.author.name,
        description: req.body.author.description,
        image: req.body.author.image
    }
    console.log(newauthor);
    var item = Authordata(newauthor);
    item.save();
});

app.put('/update_author',verifyToken,(req,res)=>{
    console.log(req.body);
    var newauthor = {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    }
    id = req.body._id;
    Authordata.findByIdAndUpdate({'_id':id},
                                {$set:{'name':newauthor.name,
                                    'description':newauthor.description,
                                    'image':newauthor.image}})
    .then(function(){
        res.send();
    });
});

app.delete('/delete_author/:id',verifyToken,(req,res)=>{
    id=req.params.id;
    Authordata.findByIdAndDelete({'_id':id})
    .then(function(){
        console.log('Book Deleted');
        res.send();
    });
})

//Author Activities Ends Here

//Port Configuration

app.listen(port,()=>
           {console.log('Listening at port'+port)});*/