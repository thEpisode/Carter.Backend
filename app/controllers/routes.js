function initialize(app, express, jwt, mongoose, User, DetailedUser, Crane, globals){
	app.get('/seed', function(req, res) {
		
		/// Delete existing users
		User.remove({}, function(err){
			if(err) console.log(err);
			
			console.log('Deleted Users')
			DetailedUser.remove({}, function(err){
				if(err) console.log(err);
				
				console.log('Deleted detailed users');
				
				/// Create Cranes
				var licensePlate = 'RTG638';
				var crane = new Crane({
					LicensePlate : licensePlate,
					Active : true
				});
				crane.save(function(err, result, numAffected){
					if (err) throw err;
					
					var detailedDriver = new DetailedUser({
						PhoneNumber: "3013494888", 
						Name: "Andres",
						LastName: "Perez",
						GeneralCalification: 5,
						Cranes:[{_id: String(result._id), LicensePlate: result.LicensePlate, Active: result.Active}]
					});
                    
                    globals.Cranes.push(result);
					
					detailedDriver.save(function(err, result, numAffected){
						if (err) throw err;
						
						console.log('DetailedUser saved successfully as index: ' + numAffected);
						
						var driver = new User({
							DetailedUserId: String(result._id),
							Email: 'andres@outlook.com', 
							Password: '123456',
							Role: 1,
							Status: 0
						});
						driver.save(function(userErr, result, numAffected){
							if (userErr) throw userErr;
							
							console.log('Driver User saved successfully');
						})
					});
				});
				
				/// Create new users
				var detailedAdminUser = new DetailedUser({
					PhoneNumber: "3103494806", 
					Name: "Camilo",
					LastName: "Rodriguez",
					GeneralCalification: 5
				}); 
				
				detailedAdminUser.save(function(err, result, numAffected){
					if (err) throw err;
					
					console.log('DetailedUser saved successfully as index: ' + numAffected);
				
					var adminUser = new User({
						DetailedUserId: String(result._id),
						Email: 'camiepisode@outlook.com', 
						Password: '1234567',
						Role: 0,
						Status: 0
					});
					
					adminUser.save(function(userErr, result, numAffected) {
						if (userErr) throw userErr;
					
						console.log('Admin User saved successfully');
					});
				});
				
				var detailedRequester = new DetailedUser({
					PhoneNumber: "3053494888", 
					Name: "Lucia",
					LastName: "Vargas",
					GeneralCalification: 5
				});
				
				detailedRequester.save(function(err, result, numAffected){
					if (err) throw err;
					
					console.log('DetailedUser saved successfully as index: ' + numAffected);
					
					var requester = new User({
						DetailedUserId: String(result._id),
						Email: 'lucia@outlook.com', 
						Password: '123456',
						Role: 2,
						Status: 0
					});
					requester.save(function(userErr, result, numAffected){
						if (userErr) throw userErr;
						
						console.log('Requester User saved successfully');
					})
				})
				res.json({ success: true, message: 'Seed generated successfully.' });
			})
		})
		
	});
		
	// API ROUTES -------------------
	
	// get an instance of the router for api routes
	var apiRoutes = express.Router(); 
	
	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRoutes.post('/authenticate', function(req, res) {
		// find the user
		User.findOne({
			Email: req.body.email
		}, function(err, user) {
		
			if (err) throw err;
		
			if (!user) {
				res.json({ success: false, message: 'Authentication failed. User not found.' });
			} 
			else if (user) {
		
				// check if password matches
				if (user.Password != req.body.password) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {
			
					// if user is found and password is right
					// create a token
					var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
					});
					
					var query = { _id:  new mongoose.Types.ObjectId(user.DetailedUserId) }; 
					DetailedUser.findOne(query, function(err, detailedUser){
					if (err) throw err;
					
					if(!detailedUser){
						res.json({ success: false, message: 'Authentication failed. Detailed User not found.' });
					}else if(detailedUser){
						// Status changed
						user.Status = 1;
						user.save(function(err){});
						// return the information including token as JSON
						res.json({
							success: true,
							message: 'Enjoy your token!',
							token: token,
							userId: user._id,
							detailedUserId: detailedUser,
							status: user.Status,
							role: user.Role
						});
					}
					});
				}   
		
			}
		
		});
	});
	
	// route middleware to verify a token
	apiRoutes.use(function(req, res, next) {
	
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	// decode token
	if (token) {
	
		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
		if (err) {
			return res.json({ success: false, message: 'Failed to authenticate token.' });    
		} else {
			// if everything is good, save to request for use in other routes
			req.decoded = decoded;    
			next();
		}
		});
	
	} else {
	
		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});
		
	}
	});
	
	// route to show a random message (GET http://localhost:8080/api/)
	apiRoutes.get('/', function(req, res) {
		res.json({ message: 'Welcome to the coolest API on earth!' });
	});
	
	// route to return all users (GET http://localhost:8080/api/users)
	apiRoutes.get('/users', function(req, res) {
		User.find({}, function(err, users) {
			res.json(users);
		});
	});   
	
	// route to return all users (GET http://localhost:8080/api/detaileduser)
	apiRoutes.get('/detaileduser', function(req, res) {
		var _id = req.query.id;
		
		var query = { _id:  new mongoose.Types.ObjectId(_id) }; 
		
		DetailedUser.findOne(query, function(err, detailedUser){
			
			if (err) throw err;
            
            var cranes = [];
            for(var i = 0; i<detailedUser.Cranes.length; i++){
                var currentCrane = {
                    CraneId : String(detailedUser.Cranes[i]._id),
                    LicensePlate : detailedUser.Cranes[i].LicensePlate,
                    Active:detailedUser.Cranes[i].Active
                }
                //console.log(detailedUser.Cranes[i]);
                cranes.push(currentCrane);
            }
            
            detailedUser.Cranes = cranes;
			
			res.json(detailedUser);
		});
	});   
	
	// apply the routes to our application with the prefix /api
	app.use('/api', apiRoutes);
}

exports.initialize = initialize;