module.exports = {
	titleCase: function(str) {
		return str.split(' ').map(substr => substr ? (substr[0].toUpperCase() + substr.substr(1, substr.length)) : '').join(' ');
	}
};