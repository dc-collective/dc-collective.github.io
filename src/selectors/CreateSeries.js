let React = require("react");

let CategoryDropdown = require('./CategoryDropdown');
let UserDropdown = require('./UserDropdown');

class CreateSeries extends React.Component {

	constructor(props) {
		super(props);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onAuthorChange = this.onAuthorChange.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);
	}

	onTitleChange({target: {value}}) {
		let {onChange, author, category} = this.props;
		let title = value;
		let route = value ? value.toLowerCase().replace(/\s/g, '-').replace(/\//g, '-') : '';
		onChange({
			title,
			author,
			category,
			route
		});
	}
	onAuthorChange({target: {value}}) {
		let {onChange, title, route, category} = this.props;
		let author = value;
		onChange({
			title,
			author,
			category,
			route
		});
	}
	onCategoryChange({ target: { value } }) {
		let { onChange, title, route, author } = this.props;
		let category = value;
		onChange({
			title,
			author,
			category,
			route
		});
	}

	render() {
		let { onClick, title, author, category } = this.props;

		return (<div>
			<input type="text" value={title} onChange={this.onTitleChange} />
			<UserDropdown label='Author' onChange={this.onAuthorChange} value={author} />
			<CategoryDropdown onChange={this.onCategoryChange} value={category} />
			<button className="button" onClick={onClick}>Add</button>
		</div>)
	}
}

export default CreateSeries;