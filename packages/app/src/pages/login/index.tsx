/**
 * Vendor imports.
 */
import { lazy } from "react";
import { Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
const Login = lazy(() => import("./login"));
const ArtiFACT = lazy(() => import("./ArtiFACT"));

/**
 * Types.
 */
interface Props {}

/**
 * login functional component.
 */
export default function login({}: Props) {
  return (
    <Switch>
      <Route exact path="/login/" component={Login} />
      <Route exact path="/login/ArtiFACT" component={ArtiFACT} />
    </Switch>
  );
}
