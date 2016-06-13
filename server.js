var express = require('express');
var app=express();
var server =require('http').createServer(app);
var io= require('socket.io').listen(server);
var nicknames= [];
var room;
server.listen(3000);
console.log('server  started at 3000');



app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});


io.sockets.on('connection',function(socket){
	socket.on('new user',function(data,callback){
		if(nicknames.indexOf(data) != -1){
			callback(false);
		}
		else
		{
        callback(true);
  	    socket.nickname =data;
  	    // console.log(typeof socket.nickname);
  	    // console.log(socket.nickname);


if(socket.nickname.substring( socket.nickname.indexOf('@'))=='@gmail.com'){
  
   room= 'GmailRoom';
 console.log(room);
console.log('gmail.com')    }
else if(socket.nickname.substring( socket.nickname.indexOf('@'))=='@workscripts.in'){

     room= 'WorkscriptsRoom';
    console.log(room);
    console.log('workscripts.com')  }
else{

  room='GeneralRoom';
 console.log(room);
  console.log('General');   }

console.log(socket.nickname + ' wants to join '+ room);

  	    nicknames.push(socket.nickname);
         updateNicknames();
  }
});
	function updateNicknames()
	{
		io.sockets.emit('usernames',nicknames)
	}
		
     
		socket.on('send message',function(data){
		
		io.sockets.emit('new message',{msg:data,nick:socket.nickname});
			});
	
	  socket.on('room',function(data){
		console.log(data);
		io.sockets.emit('room',{room:room});
		console.log(room);
			});



	socket.on('disconnect',function(data){
			if(!socket.nickname)  return;
		nicknames.splice(nicknames.indexOf(socket.nickname),1);

       updateNicknames();
			
		});
});