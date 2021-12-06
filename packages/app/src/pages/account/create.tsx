/**
 * Vendor imports.
 */
import { useState, useReducer, useEffect, useContext } from "react";
import { useHistory, Link, generatePath } from "react-router-dom";
import { validate as validateEmail } from "email-validator";

/**
 * Custom imports.
 */
import { AccountType, ErrorType } from "db";
import { useCSS, useDB, useLocale } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";
import LoadBox from "../../components/LoadBox/LoadBox";
import FormInput from "../../components/FormInput/FormInput";
import FormSuggestion from "../../components/FormSuggestion/FormSuggestion";
import FormSelect from "../../components/FormSelect/FormSelect";
import Button from "../../components/Button/Button";
import { reducer } from "./form-state";

/**
 * Types.
 */
const path = "/account/new/:errorOrSuccess";

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
  suggestions: string[] | undefined;
  onSubmit?: (user: AccountType | undefined) => void;
  onError?: (error: ErrorType) => void;
}

/**
 * create functional component.
 */
export default function create({ suggestions, onSubmit, onError }: Props) {
  const { locale } = useLocale("dk/DK");
  const { css } = useCSS(({ spacing }) => ({
    form: {
      display: "flex",
      flexFlow: "column",
      alignItems: "flex-end",
      width: "fit-content",
      position: "relative",
      left: `calc(-1em * ${locale.pages.account.create.confirmPassword.length} * 0.33)`,
      margin: `${spacing * 2}px auto 0 auto`,
      whiteSpace: "nowrap",
    },
    button: {
      margin: `0 ${spacing}px 0 0`,
    },
  }));
  const { db } = useDB();
  const history = useHistory();
  const { state, dispatch } = useContext(AppStateContext);
  const [formState, setFormState] = useReducer(reducer, {
    email: "",
    password: "",
    confirmedPassword: "",
    firstName: "",
    lastName: "",
    city: "",
    region: "",
    country: "Danmark",
  });
  const [forceLoad, setForceLoad] = useState(false);
  const [validated, setValidated] = useState(false);

  const validate = (validator: () => boolean) => {
    return () => {
      const flag = validator();

      if (flag && Object.values(formState).every((value) => value !== "")) {
        setValidated(true);
      } else {
        setValidated(false);
      }

      return flag;
    };
  };

  const handleSubmit = async () => {
    setForceLoad(true);

    const { email, password, firstName, lastName, city, region } = formState;

    const response = await db.signUp(email, password, {
      firstName,
      lastName,
      city,
      region,
      country: "Denmark",
    });

    if ("error" in response) {
      console.log(response); //N.B. remove this eventually.
      history.push(
        generatePath(path, {
          errorOrSuccess: "error",
        })
      );

      if (onError) {
        onError(response.error);
      }
      return;
    }

    if (onSubmit) {
      onSubmit(response);
    }

    setTimeout(() => {
      history.push(
        generatePath(path, {
          errorOrSuccess: "success",
        })
      );
    });
  };

  useEffect(() => {
    dispatch({
      type: "CURRENT_PATH",
      value: {
        section: state.currentPath!.section,
        label: locale.pages.account.create.label,
      },
    });
  }, []);

  return (
    <LoadBox data={forceLoad ? undefined : suggestions}>
      <section css={css.form}>
        <FormInput
          type="email"
          label={locale.pages.account.create.email}
          value={formState.email}
          validate={validate(() => validateEmail(formState.email))}
          onChange={(value) => {
            setFormState({ type: "SET_VALUE", value: { key: "email", value } });
          }}
        />
        <br />
        <FormInput
          type="password"
          label={locale.pages.account.create.password}
          value={formState.password}
          validate={validate(
            () => formState.password !== "" && formState.password.length > 5
          )}
          onChange={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "password", value },
            });
          }}
        />
        <FormInput
          type="password"
          label={locale.pages.account.create.confirmPassword}
          value={formState.confirmedPassword}
          dependencies={[formState.password]}
          validate={validate(
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
        <br />
        <FormInput
          type="text"
          label={locale.pages.account.create.firstName}
          value={formState.firstName}
          validate={validate(() => formState.firstName !== "")}
          onChange={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "firstName", value },
            });
          }}
        />
        <FormInput
          type="text"
          label={locale.pages.account.create.lastName}
          value={formState.lastName}
          validate={validate(() => formState.lastName !== "")}
          onChange={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "lastName", value },
            });
          }}
        />
        <br />
        <FormSuggestion
          label={locale.pages.account.create.city}
          value={formState.city}
          suggestions={suggestions}
          validate={validate(() => formState.city !== "")}
          onChange={(value) => {
            setFormState({ type: "SET_VALUE", value: { key: "city", value } });
          }}
          onSelect={(value) => {
            setFormState({ type: "SET_VALUE", value: { key: "city", value } });
          }}
        />
        <FormSelect
          label={locale.pages.account.create.region}
          value={formState.region}
          items={regions}
          validate={validate(() => formState.region !== "")}
          onSelect={(value) => {
            setFormState({
              type: "SET_VALUE",
              value: { key: "region", value },
            });
          }}
        />
        <br />
        <div>
          <Button
            css={css.button}
            type="accept"
            disabled={!validated}
            onClick={handleSubmit}
          >
            {locale.components.Button.submit}
          </Button>
          <Link to="/" tabIndex={-1}>
            <Button>{locale.components.Button.cancel}</Button>
          </Link>
        </div>
      </section>
    </LoadBox>
  );
}
