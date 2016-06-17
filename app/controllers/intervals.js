/* 
================
Intervals
*/
/// Basic interval to execute every x time
var basicInterval;

function initialize(){
	basicInterval = setInterval(function(){
			///
	}, 1000);
	console.log('Intervals defined');
}

exports.initialize = initialize;
exports.basicInterval = basicInterval;