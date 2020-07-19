let React = require("react");
let swearFilter = require('./utilities/swearFilter').default;

class IssueContent extends React.Component {

	render() {
		let {title, formattedNumber, date, author, subtitle, content} = this.props;
		// I'll let people toggle this off eventually, but gotta preserve Alias's innocent eyes
		content = swearFilter(content);
		return (
			<div className="col-md-8 blog-main">
				<h3 className="pb-3 mb-4 font-italic border-bottom">{title}</h3>
				<div className="blog-post">
					<h2 className="blog-post-title">ISSUE {formattedNumber}</h2>
					<p className="blog-post-meta">{date} by {author}</p>
					<h3> <em>{subtitle}</em> </h3>
					<hr />
					<span dangerouslySetInnerHTML={{__html: content}} />
				</div>
			</div>
		);
	}
}

module.exports = IssueContent;