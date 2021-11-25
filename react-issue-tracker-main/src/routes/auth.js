import { Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import NotFound from "../NotFound";
import CreateIncident from "../pages/CreateIncident";
import EditIncident from "../pages/EditIncident";
import Home from "../pages/Home";
import IncidentDetails from "../pages/IncidentDetail";
const AUTH_ROUTES = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/create",
    component: CreateIncident,
    exact: true,
  },
  {
    path: "/incidents/:id",
    component: IncidentDetails,
    exact: true,
  },
  {
    path: "/edit/:id",
    component: EditIncident,
    exact: true,
  },
  {
    path: "*",
    component: NotFound,
  },
];
export default function AuthRouter() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Switch>
          {AUTH_ROUTES.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Switch>
      </div>
    </div>
  );
}
