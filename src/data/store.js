let createStore = require('redux').createStore;
let Immutable = require("immutable");
let { startOfWeek, addDays, format } = require('date-fns');

function reducer(state = Immutable.fromJS({
	users: {}, titles: {}, issues: {}, comments: {}, categories: {}, wipIssue: {
		content: '',
		title: '',
		series: '',
		author: '',
		editor: '',
		number: 1,
		date: addDays(startOfWeek(new Date()), 10)}}), action) {
	let type = action.type;
	switch(type) {
		case 'APP_INIT': {
			let newState = state.withMutations(state => {
				let {
					users,
					titles,
					issues,
					categories
				} = action;

				// If we have both titles and users, nest them within the titles for easy lookup

				if(titles && issues) {
					Object.keys(issues).forEach(issueId => {
						let issue = issues[issueId];
						let seriesId = issue.series;
						let number = issue.number;
						if(titles[seriesId]) {
							if(!titles[seriesId].issues) {
								titles[seriesId].issues = {};
							}
							titles[seriesId].issues[number] = issueId;
						} else {
							console.log('seriesId %s not found in titles', seriesId);
						}
					});
				}
				state.set('users', Immutable.fromJS(users));
				state.set('titles', Immutable.fromJS(titles));
				state.set('issues', Immutable.fromJS(issues));
				state.set('categories', Immutable.fromJS(categories));
			});
			console.log('newState', newState.toJS());
			return newState;
		}
		case 'DATA_RECEIVED' : {
			let dataType = action.dataType;
			let data = action.data;
			// @TODO: Check that this is correct, structure it appropriately, any dirty data handling, etc.
			return state.set(dataType, data);
		}
		case 'DATA_POSTED' : {
			let dataType = action.dataType;
			console.log('dataType', dataType);
			let properties = action.properties;
			console.log('properties', properties.toJS());
			// Long story, do this better later
			let id = properties.get('id') || properties.get('_id');
			properties = properties.set('_id', id);
			properties = properties.delete('id');
			return state.withMutations(state => {
				state.setIn([dataType, id], properties);
				if(dataType === 'issues') {
					let id = properties.get('_id');
					let series = properties.get('series');
					let issueNumber = properties.get('number');
					if(state.hasIn(['titles', series])) {
						if(!state.hasIn(['titles', series, 'issues'])) {
							state.setIn(['titles', series, 'issues'], Immutable.Map());
						}
						state.setIn(['titles', series, 'issues', issueNumber], id);
					}
				}
			});
		}
		case 'UPDATE_WIP_ISSUE': {
			return state.mergeIn(['wipIssue'], action.properties);
		}
		default : {
			return state;
		}
	}
}

export default createStore(reducer);