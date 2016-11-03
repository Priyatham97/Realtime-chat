var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

users = [];
connections = [];

app.get('/',function(req,res){
	res.sendFile( __dirname +'/index.html')
});
 
http.listen(process.env.PORT || 1338);

io.sockets.on('connection', function(socket){

	//No of connections 
	connections.push(socket);
	console.log('%s sockets connected',connections.length);
// Disconnect
	socket.on('disconnect' , function(data){
  
    users.splice(users.indexOf(socket.username),1);
    

  });
  socket.on('chat message', function(data){
    io.emit('chat message',{msg:data , user:socket.username});
  });
 
  socket.on('new user' , function(data,callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit('get users' ,users)
  }

});
