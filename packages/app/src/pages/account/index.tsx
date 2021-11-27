/**
 * Vendor imports.
 */

import { lazy } from "react";
import { Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
const SignUp = lazy(() => import("./sign-up"));
const Verified = lazy(() => import("./verified"));

/**
 * Types.
 */
interface Props {}

/**
 * account functional component.
 */
export default function account({}: Props) {
  return (
    <section>
      <Switch>
        <Route path="/account/new/(error|success)?" component={SignUp} />
        <Route path="/account/verified" component={Verified} />
      </Switch>
    </section>
  );
}
