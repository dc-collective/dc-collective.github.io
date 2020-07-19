let React = require("react");

function About() {
	return (
		<div className="col-md-8 blog-main">
			<h3 className="pb-3 mb-4 font-italic border-bottom">
				Secret Origins
			</h3>

			<div className="blog-post">
				<h2 className="blog-post-title">
					About Us
				</h2>

				<p>
					The DCW, or DC Universe Universe, is a collaborative project by the fan writers of the DCU Community to create our own version of DC continuity.
					Like real comics, you can expect new releases of monthly, bimonthly and weekly titles on the first, second, third, and fourth Wednesdays of every month.
				</p>
			</div>
		</div>
	);
}

module.exports = About;