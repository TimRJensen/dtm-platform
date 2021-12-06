/**
 * Vendor imports.
 */

import { lazy, useState, useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { AccountType } from "db";
import { useLocale } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";

const Create = lazy(() => import("./create"));
const Success = lazy(() => import("./success"));
const Verified = lazy(() => import("./verified"));
const Profile = lazy(() => import("./profile"));

/**
 * Types.
 */
const DAWAURL =
  "https://api.dataforsyningen.dk/steder?hovedtype=Bebyggelse&undertype=by";

interface Props {}

/**
 * account functional component.
 */
export default function account({}: Props) {
  const { locale } = useLocale("dk/DK");
  const { state, dispatch } = useContext(AppStateContext);
  const [data, setData] = useState<string[]>();
  const [user, setUser] = useState<AccountType>();

  const _fetch = async () => {
    const response = await fetch(DAWAURL);
    const data = await response.json();

    setData(data.map((element: any) => element.primærtnavn));
  };

  useEffect(() => {
    _fetch();

    dispatch({
      type: "CURRENT_PATH",
      value: { section: locale.pages.account.section },
    });
  }, []);

  return (
    <section>
      <Switch>
        <Route
          exact
          path="/account/new"
          render={() => <Create suggestions={data} onSubmit={setUser} />}
        />
        <Route
          exact
          path={"account/new/success"}
          render={() => <Success doc={user} />}
        />
        <Route exact path="/account/verified" component={Verified} />
        <Route
          exact
          path="/account"
          render={() => <Profile user={state.currentUser} suggestions={data} />}
        />
      </Switch>
    </section>
  );
}
