let React = require("react");
let { connect } = require("react-redux");
let CreateUser = require("./CreateUser").default;
let posters = require('../data/posters').default;

class UserDropdown extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.addUser = this.addUser.bind(this);
	}

	addUser() {
		let {username} = this.state;
		if(!username) {
			alert("Missing username; add failed.");
			return;
		}
		posters.postUser({username})
			.then(newUser => {
				console.log('newUser', newUser);
				this.props.onChange({
					target: {
						value: newUser.id
					}
				});
				this.setState({username: ''});
			})
	}

	render() {
		let { users, label, value, onChange } = this.props;
		let opts = users && users.length ? [<option value="">Select a User</option>].concat(users.map(user => {
			return <option value={user._id}>{user.username}</option>
		})).concat([<option value="new">Create User</option>]) : [<option value="">Loading...</option>]
		return (<div>
			<label>{label}
				<select value={value} onChange={onChange}>
					{opts}
				</select>
				{value === "new" ?
					<CreateUser username={this.state.username || ''} onClick={this.addUser} onChange={({target: {value}}) => this.setState({username: value})} /> :
					null
				}
			</label>
		</div>);
	}
} 

function mapStateToProps(state) {
	let usersMap = state.get('users') || Immutable.Map();

	let users = [];
	usersMap.forEach(user => {
		users.push(user.toJS());
	});
	users = users.sort(({ username: aLabel }, { username: bLabel }) => {
		if (aLabel === bLabel) {
			return 0;
		}
		return aLabel.localeCompare(bLabel);
	});
	return { users };
}

module.exports = connect(mapStateToProps)(UserDropdown);