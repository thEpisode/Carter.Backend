/// Properties
var Cranes = [];
var Rates = [];

/// Show all cranes in console
function showCranesLog(){
	console.log('Showing cranes:');
	console.log(Cranes);
	console.log('====================')
}

function searchInArrayByName(nameKey, array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].Name === nameKey) {
			return array[i];
		}
	}
}

function searchInArrayById(id, array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].Id === id) {
			return array[i];
		}
	}
}

function getIndexOf(id, array){
	for (var i = 0; i < array.length; i++) {
		if (array[i].Id === id) {
			return i;
		}
	}
}

function setCrane(crane){
	var currentCrane = searchInArrayById(crane.Id, Cranes);
	var index = getIndexOf(crane.Id, Cranes);
	
	if(currentCrane != undefined && currentCrane != null){
		currentCrane.Position = crane.Position;
	
		Cranes[index] = currentCrane;
	}
	else{
		Cranes.push(crane) ;
	}
}

function searchCrane(){
    //console.log(Cranes);
	return Cranes[0];
}

exports.showCranesLog = showCranesLog;
exports.searchInArrayByName = searchInArrayByName;
exports.searchInArrayById = searchInArrayById;
exports.getIndexOf = getIndexOf;
exports.setCrane = setCrane;
exports.searchCrane = searchCrane;

exports.Cranes = Cranes;
exports.Rates = Rates;