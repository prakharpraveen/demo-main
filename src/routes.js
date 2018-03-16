import React from 'react';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Layout from './layout';
import Main from 'Pages/main';
import Ifr from 'Pages/ifr';
const routes = [
	{
		path: '/',
		exact: true,
		component: Main
	},
	{
		path: '/ifr',
		component: Ifr
	}
];
const RouteWithSubRoutes = (route) => (
	<Route
		path={route.path}
		render={(props) => (
			// pass the sub-routes down to keep nesting
			<route.component {...props} />
		)}
	/>
);
const RouteConfig = () => (
	<Router>
		<Layout>
			<Switch>{routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}</Switch>
		</Layout>
	</Router>
);
export default RouteConfig;
