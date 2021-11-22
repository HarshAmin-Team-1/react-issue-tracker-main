import { Switch, Route } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import NotFound from "../NotFound";
import Signin from "../pages/Signin";
import ForgotPass from "../pages/Signin/ForgotPass";
import Signup from "../pages/Signup";

const PUBLIC_ROUTES = [
  {
    path: "/",
    component: Signin,
    exact: true,
  },
  {
    path: "/forgotPassword",
    component: ForgotPass,
    exact: true,
  },
  {
    path: "/signup",
    component: Signup,
    exact: true,
  },
];

export default function PublicRouter() {
  return (
    <div className="App">
      <PublicNavbar />
      <div className="content">
        <Switch>
          {PUBLIC_ROUTES.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
          <Route exact path="/">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
