let React = require("react");

class Footer extends React.Component {
	render() {
		return (
			<footer className="blog-footer">
				<p>Want to join the DC Universe Universe? Drop in at <a href="https://community.dcuniverse.com/t/calling-all-dc-universe-writers-the-dc-shared-universe-bullpen-dcw/731005">our DCU thread.</a>
				</p>
				<p>
					<a href="#">Back to top</a>
				</p>
			</footer>
		);
	}
}

module.exports = Footer;