/**
 * Vendor imports.
 */
import { AccountType } from "db";
import { useState, useEffect, useContext, lazy } from "react";
import { Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { ErrorType } from "db";
import { AppStateContext } from "../../components/App/app-state/main";
import { InputType } from "../../components/FormSuggestion/FormSuggestion";

const Create = lazy(() => import("./create"));
const Success = lazy(() => import("./success"));
const Error = lazy(() => import("./error"));
const Pending = lazy(() => import("./pending"));

/**
 * Types.
 */
const DAWAURL =
  "https://api.dataforsyningen.dk/steder?hovedtype=Bebyggelse&undertype=by";

const path = "/account/new";

interface Props {}

/**
 * signUp functional component.
 */
export default function signUp({}: Props) {
  const { dispatch } = useContext(AppStateContext);
  const [user, setUser] = useState<AccountType>();
  const [error, setError] = useState<ErrorType>();
  const [data, setData] = useState<InputType>();

  const _fetch = async () => {
    const response = await fetch(DAWAURL);
    const data = await response.json();

    setData({
      key: "primærtnavn",
      data,
    });
  };

  useEffect(() => {
    _fetch();

    dispatch({
      type: "CURRENT_PATH",
      value: { section: "account", label: "new" },
    });
  }, []);

  return (
    <Switch>
      <Route
        exact
        path={path}
        render={() => (
          <Create suggestions={data} onSubmit={setUser} onError={setError} />
        )}
      />
      <Route path={path + "/success"} render={() => <Success doc={user} />} />
      {/* <Route path="/account/new/pending" component={Pending} /> */}
      <Route path={path + "/error"} render={() => <Error error={error} />} />
    </Switch>
  );
}
