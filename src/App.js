let React = require("react");
let { Provider } = require('react-redux');
let {
	HashRouter: Router,
	Switch,
	Route,
	Link,
	useRouteMatch,
	useParams
} = require("react-router-dom");

let Header = require('./Header');
let Nav = require('./Nav');
let Sidebar = require('./Sidebar');
let Footer = require('./Footer');
let IssueWrapper = require('./IssueWrapper');
let TitleDirectory = require('./TitleDirectoryWrapper');
let About = require('./About');
let IssueEditor = require('./IssueEditor');

const App = (props) =>  {
	let {store} = props;
	return (
		<Provider store={store}>
			<Router>
				<div className="container">
					<Header />
					<Nav />
					<main role="main" className="container">
						<div className="row">
							<Switch>
								<Route path={`/titles/:titleId/:postId`}>
									<IssueWrapper />
								</Route>
								<Route path={`/titles/:titleId`}>
									<TitleDirectory />
								</Route>
								<Route path='/titles'>
									Todo: Directory of all titles
								</Route>
								<Route path='/releases'>
									Todo: Directory of all releases, by week
								</Route>
								<Route path='/about'>
									<About />
								</Route>
								<Route path='/new'>
									<IssueEditor />
								</Route>
							</Switch>
							<Sidebar />
						</div>
					</main>
				</div>
				<Footer />
			</Router>
		</Provider>
	);
}

// class App extends React.Component {
// 	render() {
// 		return (
// 			<Router>
// 				<div>
// 					<ul>
// 						<li>
// 							<Link to="/">Home</Link>
// 						</li>
// 						<li>
// 							<Link to="/about">About</Link>
// 						</li>
// 						<li>
// 							<Link to="/topics">Topics</Link>
// 						</li>
// 					</ul>

// 					<Switch>
// 						<Route path="/about">
// 							<About />
// 						</Route>
// 						<Route path="/topics">
// 							<Topics />
// 						</Route>
// 						<Route path="/">
// 							<Home />
// 						</Route>
// 					</Switch>
// 				</div>
// 			</Router>
// 	);
// 	}
// }

// class Home extends React.Component {
// 	render() {
// 		return <h2>Home</h2>;
// 	}
// }

// class About extends React.Component {
// 	render() {
// 		return <h2>About</h2>;
// 	}
// }

// function Topics() {
// 	let match = useRouteMatch();
// 	return (
// 		<div>
// 			<h2>Topics</h2>

// 			<ul>
// 				<li>
// 					<Link to={`${match.url}/components`}>Components</Link>
// 				</li>
// 				<li>
// 					<Link to={`${match.url}/props-v-state`}>
// 						Props v. State
//           </Link>
// 				</li>
// 			</ul>

// 			{/* The Topics page has its own <Switch> with more routes
//           that build on the /topics URL path. You can think of the
//           2nd <Route> here as an "index" page for all topics, or
//           the page that is shown when no topic is selected */}
// 			<Switch>
// 				<Route path={`${match.path}/:topicId`}>
// 					<Topic />
// 				</Route>
// 				<Route path={match.path}>
// 					<h3>Please select a topic.</h3>
// 				</Route>
// 			</Switch>
// 		</div>
// 	);
// }

// function Topic() {
// 	let { topicId } = useParams();
// 	return <h3>Requested topic ID: {topicId}</h3>;
// }

module.exports = App;
