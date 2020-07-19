let React = require("react");
let {
	Link
} = require("react-router-dom");

class Header extends React.Component {
	render() {
		return (
			<header className="blog-header py-3">
				<div className="row flex-nowrap justify-content-between align-items-center">
					<div className="col-4 pt-1">
						<a className="text-muted" href="https://community.dcuniverse.com/">A DCU fan project</a>
					</div>
					<div className="col-5 text-center">
						<Link className="blog-header-logo text-dark" to="/">THE DCW COLLECTIVE</Link>
					</div>
					<div className="col-3 d-flex justify-content-end align-items-center">
						<Link className="btn btn-sm btn-outline-secondary" to="/about">About</Link>
					</div>
				</div>
			</header>
		);
	}
}

module.exports = Header;