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

const Form = lazy(() => import("./form"));
const Success = lazy(() => import("./success"));
const Error = lazy(() => import("./error"));

/**
 * Types.
 */
const DAWAURL =
  "https://api.dataforsyningen.dk/steder?hovedtype=Bebyggelse&undertype=by";

interface Props {}

/**
 * create functional component.
 */
export default function create({}: Props) {
  const { state, dispatch } = useContext(AppStateContext);
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
        path="/account/new"
        render={() => (
          <Form suggestions={data} onSubmit={setUser} onError={setError} />
        )}
      />
      <Route
        path="/account/new/success"
        render={() => <Success doc={user} />}
      />
      <Route path="/account/new/error" render={() => <Error error={error} />} />
    </Switch>
  );
}
