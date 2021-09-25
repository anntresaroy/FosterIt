const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://userone:userone@cluster0.6ragu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const schema = mongoose.Schema;

const AuthorSchema = new schema({
    name: String,
    description: String,
    image: String
});

var Authordata = mongoose.model('Authordata',AuthorSchema);

module.exports = Authordata;