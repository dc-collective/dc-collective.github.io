let React = require("react");

class CreateUser extends React.Component {
	render() {
		let {onClick, onChange, username} = this.props;

		return (<div>
			<input type="text" value={username} onChange={onChange} />
			<button className="button" onClick={onClick}>Add</button>
		</div>)
	}
}

export default CreateUser;