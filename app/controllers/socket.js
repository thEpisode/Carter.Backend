function initialize(io, globals, mongoose, User, DetailedUser, Crane){

	var MAX_CLIENTS = 5;
	var namespace_queue = [];

    function searchObjectOnArray(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].id === nameKey) {
                return myArray[i];
            }
        }
    }

	function createNamespace(data){
		var ns = {
					//id: require('node-uuid')(),
                    id : data.name,
					clients: 0, 
				};

		namespace_queue.push(ns);

		return ns;
	}

	createNamespace({name: 'primer'});

	io.of('').on('connection', function(socket){     

		console.log('-' + socket.id);
	
		/// Welcome to the new client
		socket.emit('Welcome', {SocketId : socket.id});
        
        socket.on('JoinToApp', function (data, callback) {
            var namespaceToConnect = searchObjectOnArray(data.namespace, namespace_queue)
            if(namespaceToConnect.clients <= MAX_CLIENTS){
                var dynamicNamespace = io.of('/' + namespaceToConnect.id);
				
                dynamicNamespace.on('connection', function(ns_socket){
                        console.log('user connected to ' + namespaceToConnect.id);
                        dynamicNamespace.emit('hi', 'everyone!');
                    });
                    
			    namespaceToConnect.clients++;  
            }          
            
            callback({namespaces:namespace_queue});
        })
        
		socket.on('createNamespace',function(data,join_cb){
            
			createNamespace(data);

			join_cb({message:'Namespace created'});
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