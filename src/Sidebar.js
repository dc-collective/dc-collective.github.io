let React = require("react");
let {
	Link
} = require("react-router-dom");

let titles = require('./titles/index');

// import { library, faCrown } from '@fortawesome/fontawesome-free';

class Sidebar extends React.Component {
	render() {

		return (
			<aside className="col-md-4 blog-sidebar">
				<div className="p-3 mb-3 bg-light rounded">
					<h4 className="font-italic">Sponsored Content</h4>
					<p className="mb-0">
						Want to target that special someone?
						Looking for insights on your audience?
						We've got you covered.
					</p>
					<small>
						<a className="text-muted" href="../events/alpha/alpha-special-oneshot.html">
							Powered by Koning 👑
						</a>
					</small>
				</div>

				<div className="p-3">
					<h4 className="font-italic">Series</h4>
					<ol className="list-unstyled mb-0">
						TODO!
					</ol>
				</div>

				<div className="p-3">
					<h4 className="font-italic">Events</h4>
					<ol className="list-unstyled">
						<li><a href="../events/alpha/alpha-special-oneshot.html">Alpha</a></li>
					</ol>
				</div>
			</aside>
		);
	}
}

module.exports = Sidebar;