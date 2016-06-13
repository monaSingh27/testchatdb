var express = require('express');
var app=express();
var server =require('http').createServer(app);
var io= require('socket.io').listen(server);
var mongoose= require('mongoose');
var users= {};

server.listen(3000);
console.log('server  started at 3000');


//connection to database
mongoose.connect('mongodb://localhost/chat', function(err){
	if(err) {
		console.log(err);
	} else {
		console.log('Connected to mongodb!');
	}
});

var chatSchema = mongoose.Schema({
	nick: String,
	msg: String,
	//created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);


app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});


io.sockets.on('connection',function(socket){

	var query=Chat.find({});
	query.sort().limit(50).exec(function(err,docs){
		if(err) throw err;
		console.log('sending old msgs')
		socket.emit('load old msgs',docs)
	});
	socket.on('new user',function(data,callback){
      if(data in users){
  	   callback(false);
  }
  else
  {  callback(true);
  	socket.nickname =data;
  	users[socket.nickname] = socket;
    updateNicknames();

  }
});
        function updateNicknames() {
       	io.sockets.emit('usernames',Object.keys(users));
        }

		socket.on('send message',function(data){

			var newMsg = new Chat({msg:data,nick:socket.nickname})
			//console.log(nick);
			newMsg.save(function(err){
				if(err) throw err;

		
		io.sockets.emit('new message',{msg:data,nick:socket.nickname});
			})
	});

	socket.on('disconnect',function(data){
			if(!socket.nickname)  return;
			delete users[socket.nickname];

  updateNicknames();
			
		});
});
	