function initialize(io, globals, mongoose, User, DetailedUser, Crane){
	io.sockets.on('connection', function(socket){     

		console.log('-' + socket.id);
	
		/// Welcome to the new client
		socket.emit('Welcome', {SocketId : socket.id});
	
		/* 
		================
		Templates for Socket.io
		*/
		/// Template for socket event
		//socket.on('', function(data){
		//  io.sockets.emit('Name', data);
		// socket.emit('ID', {Command: 'CommandID', Values:[{ID: socket.id}]});
		//});
	
	});
		
	console.log('Socket.io initialized');
}

exports.initialize = initialize;