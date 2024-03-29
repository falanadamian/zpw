const express = require('express');
const app = express();
const mongoose = require('mongoose');
const messageSchema = require('./message.schema');

const Message = mongoose.model("message", messageSchema, 'message');

async function createMessage(username, message) {
    return new Message({
        username,
        message,
        sent: Date.now()
    }).save()
}

const CONNECTION_URL = "mongodb+srv://falana:lab7@falana-cokhj.mongodb.net/test?retryWrites=true&w=majority";

const connector = mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });

app.set('view engine', 'ejs');
app.use(express.static('public'));

const CACHE_CONTROL = process.env.CACHE_CONTROL || 'public';

app.get('/', (req, res) => {
    Message.find({}).sort({'sent': 'desc'}).exec((err, docs) => {
        console.log(docs);
		res.set('Cache-Control', CACHE_CONTROL);
        res.render('index', {messagesArray: docs});
    });
});

app.get('/json', (req, res) => {
	const object = {
  "name":"John",
  "age":30,
  "cars": {
    "car1":"Ford",
    "car2":"BMW",
    "car3":"Fiat"
  }
 };
 
		res.set('Cache-Control', CACHE_CONTROL);
		res.json(object);
	
});

app.set('port', process.env.PORT || 3000);
server = app.listen(app.get('port'));

const io = require("socket.io")(server);

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.username = "Anonymous";

    socket.on('change_username', (data) => {
        socket.username = data.username
    });

    socket.on('new_message', (data) => {
        createMessage(socket.username, data.message).then( response => {
            console.log(response);
            io.sockets.emit('new_message', {message : response.message, username : response.username, sent: response.sent});
        });
    });

    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
});
