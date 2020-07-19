// @TODO: Update appropriately
// let endpoint = 'http://localhost:8081';
let endpoint = 'https://dcw-collective.herokuapp.com';

let store = require('./store').default;
let Immutable = require("immutable");

function getter(type) {
	return new Promise((resolve, reject) => {
		let url = endpoint + '/' + type;
		fetch(url)
			.then(response => {
				if(!response.ok) {
					console.error('Non-ok response. Response was', response);
				} else {
					return response.json();
				}
			})
			.then(resolve)
			.catch(reject);
	});
}

function init() {
	return new Promise((resolve, reject) => {
		getter('init')
			.then(results => store.dispatch(Object.assign({
				type: 'APP_INIT',
			}, results)))
			.then(resolve)
			.catch(error => {
				console.error('Error initializing app', error);
				reject(error);
			});
	})
}

function getTitles() {
	return new Promise((resolve, reject) => {
		getter('titles')
			.then(titles => store.dispatch({
				type: 'DATA_RECEIVED',
				dataType: 'titles',
				data: Immutable.fromJS(titles)
			}))
			.then(resolve)
			.catch(error => {
				console.error('Error getting titles', error);
				reject(error);
			});
	})
}

function getCategories() {
	return new Promise((resolve, reject) => {
		getter('categories')
			.then(categories => store.dispatch({
				type: 'DATA_RECEIVED',
				dataType: 'categories',
				data: Immutable.fromJS(categories)
			}))
			.then(resolve)
			.catch(error => {
				console.error('Error getting categories', error);
				reject(error);
			});
	})
}

function getIssues() {
	return new Promise((resolve, reject) => {
		getter('issues')
			.then(titles => {
				store.dispatch({
					type: 'DATA_RECEIVED',
					dataType: 'issues',
					data: Immutable.fromJS(titles)
				});
			})
			.then(resolve)
			.catch(error => {
				console.error('Error getting issues', error);
				reject(error);
			});
	})
}

function getUsers() {
	return new Promise((resolve, reject) => {
		getter('users')
			.then(titles => store.dispatch({
				type: 'DATA_RECEIVED',
				dataType: 'users',
				data: Immutable.fromJS(titles)
			}))
			.then(resolve)
			.catch(error => {
				console.error('Error getting users', error);
				reject(error);
			});
	})
}

export default {
	getTitles,
	getIssues,
	getCategories,
	getUsers,
	init
};