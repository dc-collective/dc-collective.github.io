let React = require("react");
let numbersToWords = require('number-to-words');
let IssueContent = require('./IssueContent');
let IssueEditor = require('./IssueEditor');
let { connect } = require("react-redux");
let { format, parseISO } = require('date-fns');
let md = require('./utilities/markdownParser').default;
let posters = require('./data/posters').default;

class Issue extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mode: 'view'
		}
	}

	render() {
		let { titleId, postId, userDict, seriesDict, issuesBySeries, issues } = this.props;
		if (!userDict || !seriesDict || !issues || !issuesBySeries) {
			// Store hasn't finished yet; return
			return <div>Loading...</div>
		}

		console.log('this.props', this.props);

		let title = seriesDict[titleId] ? seriesDict[titleId].tittle : '';
		let postUuid = issuesBySeries[titleId] && issuesBySeries[titleId][postId] ? issuesBySeries[titleId][postId] : postId;
		let post = issues[postUuid];

		if (!post) {
			// Store hasn't finished yet; return
			return <div>Loading...</div>
		}

		// Get the raw values
		let { number, title: subtitle, date, author, content, editor } = post;

		// Now format the values
		let formattedNumber = isNaN(number) ? number : numbersToWords.toWords(number).toUpperCase();
		let isoDate = date ? parseISO(date) : undefined;
		let formattedDate = isoDate ? format(isoDate, 'MMM do, yyyy') : '';
		let authorUsername = userDict[author] || '';
		let formattedContent = md.render(content);
		// let { title, number, subtitle, date, author, content } = this.props;
		return (
			<div>
				{/*this.state.mode === 'view' ? <button className="btn" onClick={() => {
					posters.updateWipIssue({
						series: seriesDict[titleId] ? seriesDict[titleId]._id : undefined,
						number,
						date: isoDate,
						author,
						title: subtitle,
						content,
						editor
					});
					this.setState({ mode: 'edit' });
				}}>Edit</button> : <button className="btn" onClick={() => this.setState({ mode: 'view' })}>Cancel</button>*/}
				{this.state.mode === 'view' ? <IssueContent
					title={title}
					formattedNumber={formattedNumber}
					date={formattedDate}
					author={authorUsername}
					subtitle={subtitle}
					content={formattedContent}
				/> : <IssueEditor id={postUuid} />}
			</div>
		);
	}
}

function mapStateToProps(state) {
	let usersMap = state.get('users') || Immutable.Map();
	let seriesMap = state.get('titles') || Immutable.Map();
	let issues = state.get('issues') || Immutable.Map();

	let userDict = {};
	usersMap.forEach(user => {
		userDict[user.get('_id')] = user.get('username');
	});

	let seriesDict = {};
	let issuesBySeries = {};
	seriesMap.forEach(series => {
		seriesDict[series.get('route')] = series.toJS();
		seriesDict[series.get('_id')] = series.toJS();
		let seriesIssues = series.get('issues');
		seriesIssues = seriesIssues ? seriesIssues.toJS() : {};
		issuesBySeries[series.get('route')] = seriesIssues;
		issuesBySeries[series.get('_id')] = seriesIssues;
	});

	return {
		userDict,
		seriesDict,
		issuesBySeries,
		issues: issues.toJS()
	}
}

module.exports = connect(mapStateToProps)(Issue);
