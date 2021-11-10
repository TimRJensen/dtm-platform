/**
 * Vendor imports.
 */

import { useEffect, lazy, useContext } from "react";
import { Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { UserType } from "db";
import { useDB } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";

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
  const { dispatch } = useContext(AppStateContext);

  useEffect(() => {
    db.onAuthChange(async (event, session) => {
      console.log(event, session);

      if (!session) {
        return; //redirect error
      }

      const { user } = session;
      const response = await db.selectExact<UserType>(
        "accounts",
        `
          id,
          role,
          email,
          displayName,
          verified,
          stats,
      `,
        {
          match: { email: user?.email ?? "" },
        }
      );

      if ("error" in response) {
        return; //redirect error
      }

      (response.verified = session.user?.confirmed_at !== ""),
        dispatch({ type: "CURRENT_USER", value: response });
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
