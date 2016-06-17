function initialize(app, express, path){
	/// Basic configuration
	app.engine('html', require('ejs').renderFile);
	app.set("view options", {layout: false});
	
	app.use(express.static(path.join(__dirname, '../../www/'))); //  "public" off of current is root
	
	app.get('/', function(req, res){
		res.render("index.html");
	});
	console.log('FrontEnd initialized');
}

exports.initialize = initialize;