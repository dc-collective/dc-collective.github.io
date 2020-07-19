let React = require("react");
let { connect } = require("react-redux");
let CreateSeries = require("./CreateSeries").default;
let posters = require('../data/posters').default;

class SeriesDropdown extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.addSeries = this.addSeries.bind(this);
	}

	addSeries() {
		let { title, author, category, route } = this.state;
		if(!title || !author || !category || !route) {
			alert("Missing values; add failed.");
			return;
		}
		posters.postSeries({ title, author, category, route })
			.then(newSeries => {
				console.log('newSeries', newSeries);
				this.props.onChange({
					target: {
						value: newSeries.id
					}
				});
				this.setState({ title: '', author: '', category: '', route: '' });
			})
	}

	render() {
		let {titles, value, onChange} = this.props;
		let { title, author, category, route } = this.state;
		let opts = titles && titles.length ? [<option value="">Select a Series</option>].concat(titles.map(title => {
			return <option value={title._id}>{title.title}</option>
		})).concat([<option value="new">Create Title</option>]) : [<option value="">Loading...</option>]
		return (<div>
			<label>
				Series
				<select value={value} onChange={onChange}>
					{opts}
				</select>
				{value === "new" ?
					<CreateSeries title={title || ''} author={author || ''} category={category || ''} route={route || ''} onClick={this.addSeries} onChange={(value) => this.setState(value)} /> :
					null
				}
			</label>
		</div>);
	}
} 

function mapStateToProps(state) {
	let titlesMap = state.get('titles') || Immutable.Map();
	let titles = [];
	titlesMap.forEach(title => {
		titles.push(title.toJS());
	});

	titles = titles.sort(({ title: aLabel }, { title: bLabel }) => {
		if (aLabel === bLabel) {
			return 0;
		}
		return aLabel.localeCompare(bLabel);
	});

	return { titles };
}

module.exports = connect(mapStateToProps)(SeriesDropdown);