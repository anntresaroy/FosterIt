//Accessing Mongoose Package
const mongoose = require('mongoose');

//Database connection
mongoose.connect('mongodb+srv://userone:userone@cluster0.6ragu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

//Schema definition
const schema = mongoose.Schema;

const BookSchema = new schema({
    title: String,
    author: String,
    genre: String,
    image: String,
    description: String
});

//Model creation
var Bookdata = mongoose.model('Bookdata',BookSchema);

module.exports = Bookdata;