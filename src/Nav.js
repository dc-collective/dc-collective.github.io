let React = require("react");
let Immutable = require("immutable");
let {
	Link
} = require("react-router-dom");
let { connect } = require("react-redux");

let titles = require('./titles/index');

class Nav extends React.Component {
	renderNavItem({heading, options, route, id}) {
		return (<li key={id} className="p-2 nav-item">
			
			<Link
				className={options && options.length ? "text-muted dropdown-toggle" : "text-muted"}
				data-toggle="dropdown"
				to={route || "#"}
				aria-haspopup={options && options.length ? "true" : "false"}
				aria-expanded="false"
			>
				{heading}
			</Link>
			{
				options && options.length ?
					<div className="dropdown-menu">
						{options.map(({ route, label, type, id, onClick }) => type === 'divider' ? <div key={id} className="dropdown-divider"></div> : (route ? <Link onClick={onClick} key={id} className="dropdown-item" to={'/titles/' + route}>{label}</Link> :
						<div key={id} className="dropdown-item">{label}</div>))
						}
					</div> :
					null
			}
		</li>);
	}
	render() {

		let {categories, titles} = this.props;

		// @TODO: Sort this later
		let orderedCategories = categories.map(category => {
			let {label, _id} = category;
			return {
				heading: label,
				id: _id,
				options: titles[_id] ? titles[_id].sort(({ title: aLabel }, { title: bLabel}) => {
					if (aLabel === bLabel) {
						return 0;
					}
					return aLabel.localeCompare(bLabel);
				}).map(title => {
					return {
						label: title.title,
						route: title.route,
						id: title._id
					}
				}) : undefined
			}
		});

		orderedCategories = [
			{
				heading: 'Weekly Releases'
			},
			{
				heading: 'Directory'
			}
		].concat(orderedCategories);

		return (
			<nav className="py-1 mb-2">
				<ul className="nav d-flex justify-content-between">
					{orderedCategories.map(this.renderNavItem)}
				</ul>
			</nav>
		);
	}
}

function mapStateToProps(state) {
	let categoriesMap = state.get('categories') || Immutable.Map();
	let titlesMap = state.get('titles') || Immutable.Map();

	let categories = [];
	categoriesMap.forEach(category => {
		categories[category.get('order')] = category.toJS();
	});

	let titlesByCategory = {};

	titlesMap.forEach(title => {
		let category = title.get('category');
		if (!titlesByCategory[category]) {
			titlesByCategory[category] = [];
		}
		titlesByCategory[category].push(title.toJS());
	});

	return { categories, titles: titlesByCategory};
}

module.exports = connect(mapStateToProps)(Nav);