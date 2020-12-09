let React = require("react");
let {
	Link,
} = require("react-router-dom");
let Immutable = require("immutable");
let { getUnixTime, parseISO } = require('date-fns');
let { connect } = require("react-redux");


class TitleDirectoryListener extends React.Component {
	render() {
		let { titleId, url, seriesDict, issuesBySeries} = this.props;
		let title = seriesDict[titleId];
		let issues = issuesBySeries[titleId] || [];
		return (
			<div className="col-md-8 blog-main">
				<h3 className="pb-3 mb-4 font-italic border-bottom">{title}</h3>
				<div className="blog-post">
					<h2 className="blog-post-title">DIRECTORY</h2>
					<hr />
					<div>
						<ul style={{listStyle: 'none'}}>
							{issues.map(issue => {
								return <li><Link to={url + '/' + issue.issueNumber}>{(issue.issueNumber || issue.issueNumber === 0) ? issue.issueNumber + '. ' : ''}{issue.subtitle}</Link></li>;
							})}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	let seriesMap = state.get('titles') || Immutable.Map();
	let issues = state.get('issues') || Immutable.Map();

	let issuesBySeries = {};
	let seriesDict = {};

	seriesMap.forEach(series => {
		seriesDict[series.get('route')] = series.get('title');
		seriesDict[series.get('_id')] = series.get('title');
		let seriesIssues = series.get('issues');
		seriesIssues = seriesIssues ? seriesIssues.toJS() : {};
		let seriesList = [];
		Object.keys(seriesIssues).forEach(issueNumber => {
			let issueId = seriesIssues[issueNumber];
			let issue = issues.get(issueId) || Immutable.fromJS();

			if(issue) {
				seriesList.push({
					issueNumber: issueNumber,
					// This convention was so dumb and I can't believe I'm stuck with it now
					subtitle: issue.get('title'),
					date: issue.get('date')
				});
			}
		});
		seriesList.sort((a, b) => {
			let aDate = getUnixTime(parseISO(a.date));
			let bDate = getUnixTime(parseISO(b.date));
			if (aDate === bDate) {
				let aIssueNumber = a.issueNumber;
				let bIssueNumber = b.issueNumber;
				if(aIssueNumber === bIssueNumber) return 0;
				return aIssueNumber > bIssueNumber ? -1 : 1;
			}
			return aDate < bDate ? -1 : 1;
		});
		issuesBySeries[series.get('route')] = seriesList;
		issuesBySeries[series.get('_id')] = seriesList;
	});

	return {
		issuesBySeries,
		seriesDict
	}
}

module.exports = connect(mapStateToProps)(TitleDirectoryListener);
