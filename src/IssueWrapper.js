let React = require("react");
let titles = require('./titles/index');
let numbersToWords = require('number-to-words');
let IssueListener = require('./IssueListener');

let {
	useParams
} = require("react-router-dom");

function Issue() {
	let { titleId, postId } = useParams();

	// let { title, number, subtitle, date, author, content } = this.props;
	return (
		<IssueListener
			titleId={titleId}
			postId={postId}
		/>
	);
}

module.exports = Issue;