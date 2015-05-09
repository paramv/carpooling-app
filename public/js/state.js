define([
	'bb',
	'underscore'
], function(bb,_) {
	var state = new bb.Model();

	return {
		getInstance:function(){
			return state;
		}
	}
});