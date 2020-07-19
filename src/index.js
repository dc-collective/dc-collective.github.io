let React = require('react');
let ReactDOM = require('react-dom');
let App = require('./App');

let getters = require('./data/getters').default;
let store = require('./data/store').default;

window.Immutable = require("immutable");

// Every keystroke I make for this site only consigns me to a deeper layer of JavaScript Hell
// Thanks to [here](https://stackoverflow.com/questions/273789/is-there-a-version-of-javascripts-string-indexof-that-allows-for-regular-expr) for this solution though
String.prototype.regexIndexOf = function (regex, startpos) {
	var indexOf = this.substring(startpos || 0).search(regex);
	return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

ReactDOM.render(
	<React.StrictMode>
		<App store={store} />
	</React.StrictMode>,
	document.getElementById('app')
);

getters.init();