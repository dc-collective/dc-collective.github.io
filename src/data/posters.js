// @TODO: Update appropriately
// let endpoint = 'http://localhost:8081';
let endpoint = 'https://dcw-collective.herokuapp.com';

let store = require('./store').default;
let Immutable = require("immutable");
let uuid = require('uuid');

function poster(type, properties) {
	return new Promise((resolve, reject) => {
		let url = endpoint + '/' + type;
		properties.password = prompt("Please enter your password");
		if(!properties.id) {
			properties.id = uuid.v4().replace(/-/g, '');
		}
		fetch(url, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(properties)
		})
			.then(response => {
				if (!response.ok) {
					console.error('Non-ok response. Response was', response);
					alert('Error: post failed.');
				} else {
					alert('Success!');
					return response.json();
				}
			})
			.then(resolve)
			.catch(reject);
	});
}

function postIssue(properties) {
	return new Promise((resolve, reject) => {
		poster('issue', properties)
			.then(newIssue => {
				store.dispatch({
					type: 'DATA_POSTED',
					dataType: 'issues',
					properties: Immutable.fromJS(newIssue)
				});
				return newIssue;
			})
			.then(resolve)
			.catch(reject);
	});
}

function postUser(properties) {
	return new Promise((resolve, reject) => {
		poster('user', properties)
			.then(newUser => {
				console.log('newUser from postUser', newUser);
				store.dispatch({
					type: 'DATA_POSTED',
					dataType: 'users',
					properties: Immutable.fromJS(newUser)
				});
				return newUser;
			})
			.then(resolve)
			.catch(reject);
	});
}

function postSeries(properties) {
	return new Promise((resolve, reject) => {
		poster('title', properties)
			.then(newTitle => {
				store.dispatch({
					type: 'DATA_POSTED',
					dataType: 'titles',
					properties: Immutable.fromJS(newTitle)
				});
				return newTitle;
			})
			.then(resolve)
			.catch(reject);
	});
}

function updateWipIssue(properties) {
	console.log('properties', properties);
	store.dispatch({
		type: 'UPDATE_WIP_ISSUE',
		properties: Immutable.fromJS(properties)
	});
}

export default {
	postIssue,
	postSeries,
	postUser,
	updateWipIssue
};