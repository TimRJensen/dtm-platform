/**
 * Vendor imports.
 */

import { lazy } from "react";
import { Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
const Create = lazy(() => import("./create"));
const Success = lazy(() => import("./success"));
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
        <Route path="/account/new" component={Create} />
        <Route path="/account/success" component={Success} />
        <Route path="/account/verified" component={Verified} />
      </Switch>
    </section>
  );
}
