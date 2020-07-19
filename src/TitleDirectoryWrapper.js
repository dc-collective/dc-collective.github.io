let React = require("react");
let {
	useParams,
	useRouteMatch
} = require("react-router-dom");
let TitleDirectoryListener = require('./TitleDirectoryListener');

function TitleDirectory() {
	let { titleId } = useParams();
	let match = useRouteMatch();

	// let { title, number, subtitle, date, author, content } = this.props;
	return (
		<TitleDirectoryListener
			titleId={titleId}
			url={match.url}
		/>
	);
}

module.exports = TitleDirectory;