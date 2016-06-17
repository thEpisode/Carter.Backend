function initialize(io, globals, mongoose, User, DetailedUser, Crane){
	io.sockets.on('connection', function(socket){     

		console.log('-' + socket.id);
	
		/// Welcome to the new client
		socket.emit('Welcome', {SocketId : socket.id});
		
		/// Used for push a new crane
		socket.on('PushCrane', function(data){
			if(data != undefined && data != null){
				var crane = JSON.parse(data)
				globals.Cranes.push(crane) ;
			}
		});
		
		/// Used for set the position of crane
		socket.on('SetPositionCrane', function(data){
            console.log('SetPositionCrane');
			if(data != undefined && data != null){
				globals.setCrane(data);
				//globals.showCranesLog();
			}
		});
	
		/// Get all cranes
		socket.on('GetCranes', function(data){
			getCranes();
		});
	
		/// Used for show all cranes in console
		socket.on('ShowBackendCraneLogs', function(data){
			globals.showCranesLog();
		});
		
		socket.on('GetCrane', function(data){
			if(data != undefined && data != null){
			var idCrane = JSON.parse(data.Id);
			var crane = globals.searchInArrayById(idCrane, globals.Cranes);
			
			socket.emit('Backend.Message', {Command: 'CraneInformation', Values: crane});   
			}
		});
		
		socket.on('RateCrane', function(data){
			if(data != undefined && data != null){
				var rate = JSON.parse(data);
				
				globals.Rates.push(rate);
				io.sockets.emit('Thanks4Rate');
			}
		});
		
		socket.on('ChangeStatus', function(data, isSuccess){
			console.log(data);
			User.findOne({
				Email: data.Email
				}, function(err, user) {
				
					if (err) throw err;
				
					if (user) {
						user.Status = data.status;
						user.save(function(err){
							if(err) throw err;
							else isSuccess(true);
						});
					}
				});
		});
		
		/// Get all cranes
		socket.on('RequestJob', function(data){
			console.log('RequestJob fired');
            console.log(data);
			var crane = globals.searchCrane();
            if(crane != undefined && crane != null)
            {
                console.log("==Crane==");
                console.log(crane);
			    io.sockets.emit('Backend.Message', {Command: 'RequestJob', Values: {CraneId: String(crane.Id), Details: data.Details, RequesterId: data.Id, RequesterPosition: data.Position, RequestType:data.Type}});
            }
            else
            {
                io.sockets.emit('Backend.Message', {Command: 'NoCranesAvailable', Values: {Message: "In this moment we haven't available cranes"}});
            }
		});
		
		socket.on('ConfirmedJob', function(data){
			io.sockets.emit('Backend.Message', {Command: 'ConfirmedJob', Values: {Driver: data.Driver, Requester: data.Requester}})
		})
		
		/* 
		================
		Local functions 
		*/
		
		/// Emit all cranes
		function getCranes(){
			
			socket.emit('Backend.Message', {Command : 'CurrentPositionCranes', Values : globals.Cranes});
		}
		
		/* 
		================
		Socket Intervals
		*/
		/// Emit every 5 seconds cranes
		setInterval(getCranes, 5000);
	
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