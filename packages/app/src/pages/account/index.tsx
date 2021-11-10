/**
 * Vendor imports.
 */

import { useEffect, lazy } from "react";
import { Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { useDB } from "../../hooks";

const Create = lazy(() => import("./create"));
const Verified = lazy(() => import("./verified"));

/**
 * Types.
 */
interface Props {}

/**
 * account functional component.
 */
export default function account({}: Props) {
  const { db } = useDB();

  useEffect(() => {
    db.onAuthChange((event, session) => {
      console.log(event, session);
    });
  }, []);

  return (
    <section>
      <Switch>
        <Route path="/account/(new|success|error)" component={Create} />
        {/* <Route path="/account/success" component={Create} />
        <Route path="/account/error" component={Create} /> */}
        <Route path="/account/verified" component={Verified} />
      </Switch>
    </section>
  );
}
