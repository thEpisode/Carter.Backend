function initialize(io, globals, mongoose, User, DetailedUser, Crane){

	var MAX_CLIENTS = 2;
	var ns_queue = [];

	function createNamespace(){
		var ns = {
					id: require('node-uuid')(),
					clients: 0, 
				};

		ns_queue.push(ns);

		return ns;
	}

	createNamespace();

	io.sockets.on('connection', function(socket){     

		console.log('-' + socket.id);
	
		/// Welcome to the new client
		socket.emit('Welcome', {SocketId : socket.id});

		socket.on('JoinToApp',function(data,join_cb){
			var last_ns = ns_queue[ns_queue.length - 1];
			if(last_ns.clients >= MAX_CLIENTS){
				last_ns = createNamespace();

				var dyn_ns = io.of('/' + last_ns.id)
							.on('connection', function(ns_socket){console.log('user connected to ' + last_ns.id);});
			}

			last_ns.clients++;
			join_cb({namespace:last_ns.id});
		});
	
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