let React = require("react");
let ReactDOMServer = require('react-dom/server');
let { connect } = require("react-redux");
let posters = require('./data/posters').default;
let SimpleMDE = require("react-simplemde-editor").default;
let IssueContent = require('./IssueContent');
let numbersToWords = require('number-to-words');
let SeriesDropdown = require("./selectors/SeriesDropdown");
let UserDropdown = require("./selectors/UserDropdown");
let md = require('./utilities/markdownParser').default;

let DatePicker = require("react-datepicker").default;

let { isWednesday, startOfWeek, addDays, format } = require('date-fns');

// require("react-datepicker/dist/react-datepicker.css");


class NewPost extends React.Component {

	constructor(props) {
		super(props);

		this.handleContentChange = this.handleContentChange.bind(this);
		this.handleAuthorChange = this.handleAuthorChange.bind(this);
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleNumberChange = this.handleNumberChange.bind(this);
		this.handleSeriesChange = this.handleSeriesChange.bind(this);
		this.convertText = this.convertText.bind(this);
		this.postIssue = this.postIssue.bind(this);
	}

	handleSeriesChange({target: {value}}) {
		posters.updateWipIssue({ series: value });
	}

	handleAuthorChange({target: {value}}) {
		console.log('handleAuthorChange value', value);
		posters.updateWipIssue({ author: value });
	}

	handleEditorChange({target: {value}}) {
		posters.updateWipIssue({ editor: value });
	}

	handleDateChange(value) {
		posters.updateWipIssue({ date: value });
	}

	handleTitleChange({target: {value}}) {
		posters.updateWipIssue({ title: value });
	}

	handleNumberChange({target: {value}}) {
		posters.updateWipIssue({ number: value });
	}

	handleContentChange(content) {
		posters.updateWipIssue({ content });
	}

	postIssue() {
		let {
			content,
			title,
			series,
			author,
			editor,
			number,
			date
		} = this.props;

		if(
			!content ||
			!title ||
			!series || series === "new" ||
			!author || author === "new" ||
			!editor || editor === "new" ||
			(!number && number !== 0) ||
			!date
		) {
			alert("Missing values; add failed.");
			return;
		}

		posters.postIssue({
			content,
			title,
			series,
			author,
			editor,
			number,
			date,
			id: this.props.id
		}).then(() => {
			// Only clear the value if we have no ID
			if(!this.props.id) {
				// @TODO: Should we change this to a reset method?
				posters.updateWipIssue({
					id: undefined,
					content: '',
					title: '',
					series: '',
					author: '',
					editor: '',
					number: 1,
					date: addDays(startOfWeek(new Date()), 10) // The Wednesday of next week
				});
			}
		})
		.catch(console.error);
	}

	/**
	 * Split into an array of pages
	 * @param {*} text 
	 */
	splitPages(text) {
		let pageIndexes = [];
		for (let i = text.regexIndexOf(/PAGE[S]{0,1} /); i !== -1; i = text.regexIndexOf(/PAGE[S]{0,1} /, i + 1)) {
			pageIndexes.push(i);
		}
		let nextIssueBlurb = text.regexIndexOf(/NEXT ISSUE/i);
		if (nextIssueBlurb > -1) {
			pageIndexes.push(nextIssueBlurb);
		}
		let pages = pageIndexes.map((pageIndex, arrIndex) => {
			let nextIndex = arrIndex === pageIndexes.length - 1 ? text.length : pageIndexes[arrIndex + 1];
			return text.substring(pageIndex, nextIndex);
		});
		return pages;
	}

	/**
	 * 
	 * @param {*} text 
	 * @param {*} opts 
	 */
	splitPanels(text, opts) {
		let panelIndexes = [0];
		for (let i = text.regexIndexOf(/PANEL[S]{0,1} /); i !== -1; i = text.regexIndexOf(/PANEL[S]{0,1} /, i + 1)) {
			panelIndexes.push(i);
		}
		let panels = panelIndexes.map((panelIndex, arrIndex) => {
			let nextIndex = arrIndex === panelIndexes.length - 1 ? text.length : panelIndexes[arrIndex + 1];
			let panelText = text.substring(panelIndex, nextIndex).trim();
			// If this is the 'first' panel (e.g. the page label), return panelText unmolested
			if (!panelIndex) return panelText.trim().replace(/(PAGE[S]{0,1} .*)/g, '**$1**');
			// Otherwise, we want to append > before any newlines
			// @TODO: Simply put, this does not work. 
			let panelLines = panelText.split('\n');

			if (opts.indentPanels) {
				// We want to find any dialogue lines in order to mark them off
				let dialogueIndexes = [];
				// Skip over the first two, as those are the panel heading + description
				let i = 2;
				while(i < panelLines.length) {
					let panelLine = panelLines[i];
					// If we have a line here, it's a dialogue header. Put this + the next index in there
					if(panelLine) {
						dialogueIndexes.push(i);
						i += 2;
					} else {
						i++;
					}
				}
				dialogueIndexes.forEach(index => {
					panelLines[index] = '"""dialogue\n' + panelLines[index];
					if (panelLines[index + 1]) {
						panelLines[index + 1] = panelLines[index + 1] + '\n"""';
					}
				});
			}

			panelText = (opts.indentPanels ? '::: panel\n' : '');

			
			panelText += panelLines.map((text, textIndex) => {
				// If this is one of the strips already in the old M_S formatting, cut it, as we're doing the new stuff
				if(text.startsWith('>')) {
					text = text.replace('>', '');
				}

				// Trim it again for good measure
				return text.trim();
			}).join('\n').trim().replace(/(PANEL.*)/g, '*$1*');
			panelText += (opts.indentPanels ? '\n:::' : '');
			return panelText;
		});
		return panels;
	}

	convertText(text, opts) {
		let pages = this.splitPages(text).map(page => {
			let panels = this.splitPanels(page, opts);
			return panels.join('\n\n');
		});
		let newText = pages.join('\n\n');
		posters.updateWipIssue({ content: newText });
	}

	render() {
		console.log('this.props', this.props);
		let { title, series, content, author, editor, date, number} = this.props;
		return (
			<div>
				<div>
					<SeriesDropdown onChange={this.handleSeriesChange} value={series} />
					<UserDropdown label='Author' onChange={this.handleAuthorChange} value={author} />
					<UserDropdown label='Editor' onChange={this.handleEditorChange} value={editor} />
					<label>
						Issue Title
						<input type="text" value={title} onChange={this.handleTitleChange}/>
					</label>
					<label>
						Issue Number
						<input type="number" value={number} onChange={this.handleNumberChange}/>
					</label>
					<label>
						Week Of:
						<DatePicker
							selected={date}
							onChange={this.handleDateChange}
							filterDate={date => {
								return isWednesday(date);
							}}
							placeholderText="Select a Wednesday"
							shouldCloseOnSelect={true}
						/>
					</label>
					<SimpleMDE
						onChange={this.handleContentChange}
						value={content}
						options={{
							sideBySideFullscreen: false,
							status: true,
							spellChecker: false,
							maxHeight: '300px',
							previewRender: (plainText) => {
								let { title, series, author, date, number, userDict, seriesDict } = this.props;
								let content = md.render(plainText);
								return ReactDOMServer.renderToString(
									<IssueContent
										title={seriesDict && seriesDict[series] ? seriesDict[series] : ''}
										formattedNumber={isNaN(number) ? number : numbersToWords.toWords(number).toUpperCase()}
										date={format(date, 'MMM do, yyyy')}
										author={userDict && userDict[author] ? userDict[author] : ''}
										subtitle={title}
										content={content}
									/>
								);
							}
						}}
					/>
				</div>
				<div>
					<button className="btn" onClick={() => this.convertText(content, { indentPanels: true })}>Smart Convert Text</button>
					<button className="btn" onClick={this.postIssue}>Post Issue</button>
				</div>
			</div>
		);
	}
};

function mapStateToProps(state) {
	let usersMap = state.get('users') || Immutable.Map();
	let seriesMap = state.get('titles') || Immutable.Map();
	let propertiesMap = state.get('wipIssue').toJS();

	let userDict = {};
	usersMap.forEach(user => {
		userDict[user.get('_id')] = user.get('username');
	});

	let seriesDict = {};
	seriesMap.forEach(series => {
		seriesDict[series.get('_id')] = series.get('title');
	});
	
	return Object.assign(propertiesMap, { userDict, seriesDict });
};

module.exports = connect(mapStateToProps)(NewPost);