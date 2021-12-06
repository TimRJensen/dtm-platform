/**
 * Vendor imports.
 */
import { useState, useEffect, useReducer, FormEvent, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

/**
 * Custom imports.
 */
import { ProfileTable, UserType } from "db";
import { useCSS, useDB, useLocale } from "../../hooks";
import Button from "../../components/Button/Button";
import FormInput from "../../components/FormInput/FormInput";
import FormSelect from "../../components/FormSelect/FormSelect";
import FormSuggestion from "../../components/FormSuggestion/FormSuggestion";
import { reducer } from "./form-state";
import { AppStateContext } from "../../components/App/app-state/main";

/**
 * Types.
 */
const regions = [
  "København og omegn",
  "Aarhus",
  "Odense",
  "Aalborg",
  "Sjælland",
  "Jylland",
  "Fyn",
  "Bornholm",
  "Nordsjælland",
  "Vestsjælland",
  "Sydsjælland og Lolland-Falster",
  "Nordjylland",
  "Østjylland",
  "Midt og Vestjylland",
  "Syd og Sønderjylland",
  "Færøerne",
  "Grønland",
];

interface Props {
  user: UserType | undefined;
  suggestions: string[] | undefined;
  //onSubmit?: (user: AccountType | undefined) => void;
  //onError?: (error: ErrorType) => void;
}

/**
 * profile functional component.
 */
export default function profile({ user, suggestions }: Props) {
  if (!user) {
    return null; // 404
  }

  const { css } = useCSS(({ spacing }) => ({
    account: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      width: "fit-content",
      left: `calc(-1em * ${locale.pages.account.profile.confirmPassword.length} * 0.33)`,
      margin: "auto",
    },
    form: {
      display: "flex",
      flexFlow: "column",
      alignItems: "flex-end",
      width: "fit-content",
      position: "relative",

      margin: `${spacing * 2}px 0 0 0`,
      whiteSpace: "nowrap",
    },
    button: {
      margin: `0 ${spacing}px 0 0`,
    },
  }));
  const { locale } = useLocale("dk/DK");
  const { db } = useDB();
  const history = useHistory();
  const { state, dispatch } = useContext(AppStateContext);
  const [formState, setFormState] = useReducer(reducer, {
    email: user.email,
    password: "",
    confirmedPassword: "",
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    city: user.profile.city,
    region: user.profile.region,
    country: user.profile.country,
  });
  const [forceLoad, setForceLoad] = useState(false);
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [profileValidated, setProfileValidated] = useState(true);

  const validatePassword = (validator: () => boolean) => {
    return () => {
      const flag = validator();

      if (flag && formState.password === formState.confirmedPassword) {
        setTimeout(() => setPasswordValidated(true));
      } else {
        setPasswordValidated(false);
      }

      return flag;
    };
  };

  const validateProfile = (validator: () => boolean) => {
    return () => {
      const flag = validator();

      if (
        flag &&
        formState.firstName !== "" &&
        formState.lastName !== "" &&
        formState.city !== "" &&
        formState.region !== ""
      ) {
        setProfileValidated(true);
      } else {
        setProfileValidated(false);
      }

      return flag;
    };
  };

  const handleIdentityChange = async (event: FormEvent) => {
    event.preventDefault();
    setForceLoad(true);

    const { email, password } = formState;

    const response = await db.signInUpdate(email, password);

    if (response.error) {
      console.log(response); //N.B. remove this eventually.
      history.push("/error");
      return;
    }

    setForceLoad(false);
  };

  const handleProfileChange = async (event: FormEvent) => {
    event.preventDefault();
    setForceLoad(true);

    const { firstName, lastName, city, region } = formState;

    const response = await db.update<ProfileTable>("profiles", {
      id: user.id,
      firstName,
      lastName,
      city,
      region,
    });

    if ("error" in response) {
      console.log(response); //N.B. remove this eventually.
      history.push("/error");
      return;
    }

    setForceLoad(false);
  };

  useEffect(() => {
    dispatch({
      type: "CURRENT_PATH",
      value: {
        section: state.currentPath!.section,
        label: locale.pages.account.profile.label,
      },
    });
  }, []);

  return (
    <section css={css.account}>
      <form css={css.form} onSubmit={handleIdentityChange}>
        <FormInput
          type="password"
          label={locale.pages.account.profile.password}
          value={formState.password}
          onChange={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "password", value },
            });
          }}
          validate={validatePassword(
            () => formState.password !== "" && formState.password.length > 5
          )}
        />
        <FormInput
          type="password"
          label={locale.pages.account.profile.confirmPassword}
          value={formState.confirmedPassword}
          dependencies={[formState.password]}
          validate={validatePassword(
            () =>
              formState.confirmedPassword !== "" &&
              formState.confirmedPassword === formState.password
          )}
          onChange={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "confirmedPassword", value },
            });
          }}
        />
        <div>
          <Button css={css.button} type="accept" disabled={!passwordValidated}>
            {locale.components.Button.submit}
          </Button>
          <Link to="/account" tabIndex={-1}>
            <Button>{locale.components.Button.submit}</Button>
          </Link>
        </div>
      </form>
      <br />
      <form css={css.form} onSubmit={handleProfileChange}>
        <FormInput
          type="text"
          label={locale.pages.account.profile.firstName}
          value={formState.firstName}
          validate={validateProfile(() => formState.firstName !== "")}
          onChange={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "firstName", value },
            });
          }}
        />
        <FormInput
          type="text"
          label={locale.pages.account.profile.lastName}
          value={formState.lastName}
          validate={validateProfile(() => formState.lastName !== "")}
          onChange={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "lastName", value },
            });
          }}
        />
        <br />
        <FormSuggestion
          label={locale.pages.account.profile.city}
          value={formState.city}
          suggestions={suggestions}
          validate={validateProfile(() => formState.city !== "")}
          onChange={(value) => {
            setFormState({ type: "SET_VALUE", value: { key: "city", value } });
          }}
          onSelect={(value) => {
            setFormState({ type: "SET_VALUE", value: { key: "city", value } });
          }}
        />
        <FormSelect
          label={locale.pages.account.profile.region}
          value={formState.region}
          items={regions}
          validate={validateProfile(() => formState.region !== "")}
          onSelect={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "region", value },
            });
          }}
        />
        <br />
        <div>
          <Button css={css.button} type="accept" disabled={!profileValidated}>
            {locale.components.Button.submit}
          </Button>
          <Link to="/account" tabIndex={-1}>
            <Button>{locale.components.Button.submit}</Button>
          </Link>
        </div>
      </form>
    </section>
  );
}
