import React from "react";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import Layout from "./layout";
// import Main from 'Pages/main';
// import Ifr from 'Pages/ifr';

import Loading from "Components/Loading";

const Home = Loadable({
    loader: () => import("Pages/home"),
    loading: Loading
});
const Ifr = Loadable({
    loader: () => import("Pages/ifr"),
    loading: Loading
});
const drag = Loadable({
    loader: () => import("Pages/drag"),
    loading: Loading
});
const NotFound = Loadable({
    loader: () => import("Pages/404"),
    loading: Loading
});
const Test = Loadable({
    loader: () => import("Pages/test"),
    loading: Loading
});
const DesktopSetting = Loadable({
    loader: () => import("Pages/DesktopSetting"),
    loading: Loading
});
const AppRegister = Loadable({
    loader: () => import("Pages/AppRegister"),
    loading: Loading
});
const Zone = Loadable({
    loader: () => import("Pages/Zone"),
    loading: Loading
});
const ZoneSetting = Loadable({
    loader: () => import("Pages/ZoneSetting"),
    loading: Loading
});
const AllApps = Loadable({
    loader: () => import("Pages/AllApps"),
    loading: Loading
});
const Customize = Loadable({
    loader: () => import("Pages/Customize"),
    loading: Loading
});
const Customize1 = Loadable({
    loader: () => import("Pages/Customize/index.1.js"),
    loading: Loading
});
const MenuRegister = Loadable({
    loader: () => import("Pages/MenuRegister"),
    loading: Loading
});
const MenuItem = Loadable({
    loader: () => import("Pages/MenuItem"),
    loading: Loading
});
const TemplateSetting = Loadable({
    loader: () => import("Pages/TemplateSetting"),
    loading: Loading
});
const demo = Loadable({
    loader: () => import("Pages/demo"),
    loading: Loading
});
const routes = [
    {
        path: "/",
        exact: true,
        component: Home
    },
    {
        path: "/ifr",
        component: Ifr
    },
    {
        path: "/404",
        component: NotFound
    },
    {
        path: "/test",
        component: Test
    },
    {
        path: "/ds",
        component: DesktopSetting
    },
    {
        path: "/ar",
        exact: true,
        component: AppRegister
    },
    {
        path: "/drag",
        component: drag
    },
    {
        path: "/Zone",
        component: Zone
    },
    {
        path: "/ZoneSetting",
        component: ZoneSetting
    },
    {
        path: "/all",
        component: AllApps
    },
    {
        path: "/c",
        component: Customize
    },
    {
        path: "/c1",
        component: Customize1
    },
    {
        path: "/mr",
        component: MenuRegister
    },
    {
        path: "/mi",
        component: MenuItem
    },
    {
        path: "/TemplateSetting",
        component: TemplateSetting
    },
    {
        path: "/demo",
        component: demo
    }
];
const RouteWithSubRoutes = route => (
    <Route
        path={route.path}
        render={props => (
            // pass the sub-routes down to keep nesting
            <route.component {...props} />
        )}
    />
);

const RouteConfig = () => (
    <Router>
        <Layout>
            <Switch>
                {routes.map((route, i) => (
                    <RouteWithSubRoutes key={i} {...route} />
                ))}
                <Route
                    component={infor => <NotFound location={infor.location} />}
                />
            </Switch>
        </Layout>
    </Router>
);
export default RouteConfig;
