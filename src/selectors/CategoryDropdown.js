let React = require("react");
let { connect } = require("react-redux");

class CategoryDropdown extends React.Component {

	render() {
		let {categories, value, onChange} = this.props;
		let opts = categories && categories.length ? [<option value="">Select a Category</option>].concat(categories.map(category => {
			return <option value={category._id}>{category.label}</option>
		})) : [<option value="">Loading...</option>]
		return (<div>
			<label>
				Categories
				<select value={value} onChange={onChange}>
					{opts}
				</select>
			</label>
		</div>);
	}
} 

function mapStateToProps(state) {
	let categoryMap = state.get('categories') || Immutable.Map();
	let categories = [];
	categoryMap.forEach(category => {
		categories.push(category.toJS());
	});

	categories = categories.sort(({ label: aLabel }, { label: bLabel }) => {
		if (aLabel === bLabel) {
			return 0;
		}
		return aLabel.localeCompare(bLabel);
	});

	return { categories };
}

module.exports = connect(mapStateToProps)(CategoryDropdown);