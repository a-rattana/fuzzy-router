import React, { createContext, useContext } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link as InternalLink,
  Redirect as InternalRedirect,
  matchPath,
} from "react-router-dom";

const RouterContext = createContext();

/**
 * routes is a list of objects of the form
 * {
 *  name: string, // a short descriptive name of the route ie. "dashboard"
 *  path: string, // the url for this route ie. "/users/new"
 *  appName: string, // the app that this route belongs to
 *  permissions: string[], // a list of permissions required to access this route
 *  enablements: string[], // a list of enablements required to access this route
 * }
 *
 *
 * @param {*} param0
 */
function Router({ appName, routes, children }) {
  return (
    <RouterContext.Provider value={{ appName, routes }}>
      <BrowserRouter>{children}</BrowserRouter>
    </RouterContext.Provider>
  );
}

function useAppName() {
  const { appName } = useContext(RouterContext);
  return appName;
}

function useRoutes() {
  const { routes } = useContext(RouterContext);
  return routes;
}

function useRoute(path) {
  const routes = useRoutes();
  const [route] = routes.filter((route) =>
    matchPath(path, {
      path: route.path,
      exact: true,
      strict: true,
    })
  );
  return route;
}

/**
 * Given a path, is that path owned by the current application
 *
 * @param {string} path
 */
function useIsInternalPath(path) {
  const appName = useAppName();
  const route = useRoute(path);
  return route && route.appName === appName;
}

function ExternalLink({ to, children, ...props }) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
}

function Link({ to, children, ...props }) {
  const isInternalPath = useIsInternalPath(to);
  console.log({ to, isInternalPath });

  if (isInternalPath) {
    return (
      <InternalLink to={to} {...props}>
        {children}
      </InternalLink>
    );
  }
  return (
    <ExternalLink to={to} {...props}>
      {children}
    </ExternalLink>
  );
}

function useLink(to) {
  return ({ ...props }) => <Link to={to} {...props} />;
}

function ExternalRedirect({ to }) {
  window.location.href = to;
  return null;
}

function Redirect({ to, ...props }) {
  const isInternalPath = useIsInternalPath(to);

  if (isInternalPath) {
    return <InternalRedirect to={to} {...props} />;
  }
  return <ExternalRedirect to={to} />;
}

export { Router, Switch, Route, Link, Redirect, useRoute, useLink };
