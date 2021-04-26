import React from "react";
import { render } from "react-dom";
import { Router, Switch, Route, Link, useLink } from "../../src";

const ProtectedRoute = Route;
const ProtectedLink = Link;
const useProtectedLink = useLink;

const routes = [
  { name: "dashboard", path: "/", appName: "root" },
  { name: "users", path: "/users", appName: "root", permissions: ["users"] },
  {
    name: "userDetail",
    path: "/users/:id",
    appName: "root",
    permissions: ["users"],
  },
  {
    name: "locations",
    path: "/locations",
    appName: "root",
    enablements: ["locations"],
  },
  { path: "/app1", appName: "app1", permissions: ["app1"] },
  {
    path: "/app1/number-requests",
    appName: "app1",
    permissions: ["app1/number-requests"],
  },
  {
    path: "/app1/port-requests",
    appName: "app1",
    permissions: ["app1/port-requests"],
  },
];

function Home() {
  return <div>Home</div>;
}

function Users() {
  return <div>Users</div>;
}

function Locations() {
  return <div>Locations1</div>;
}

function UserDetails() {
  return <div>User Details: </div>;
}

function TopNav() {
  const UsersLink = useProtectedLink("/users");
  const UsersDetailLink = useProtectedLink("/users/123");
  const LocationsLink = useProtectedLink("/locations");
  const DIDsLink = useProtectedLink("/app1");
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {UsersLink && (
          <li>
            <UsersLink>Users</UsersLink>
          </li>
        )}
        {UsersDetailLink && (
          <li>
            <UsersDetailLink>User 123</UsersDetailLink>
          </li>
        )}
        {LocationsLink ? (
          <li>
            <LocationsLink>Locations</LocationsLink>
          </li>
        ) : (
          <div>No access to locations</div>
        )}
        <ProtectedLink to="/unknown">This route doesn't exist</ProtectedLink>
        {DIDsLink && (
          <li>
            <DIDsLink>DIDs</DIDsLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      <Router appName="root" routes={routes}>
        {/* <AuthorizationProvider permissions={["app1", "users"]} enablements={[]}> */}
        <header className="App-header">
          <p>Root</p>

          <TopNav />
        </header>

        <Switch>
          <ProtectedRoute path="/users/:id">
            <UserDetails />
          </ProtectedRoute>
          <ProtectedRoute path="/users">
            <Users />
          </ProtectedRoute>
          <Route path="/locations">
            <Locations />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        {/* </AuthorizationProvider> */}
      </Router>
    </div>
  );
}

render(<App />, document.querySelector("#demo"));

export default App;
