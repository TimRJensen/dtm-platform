/**
 * Vendor imports.
 */
import { useState, useReducer } from "react";
import { useHistory, Link, generatePath } from "react-router-dom";
import { validate as validateEmail } from "email-validator";

/**
 * Custom imports.
 */
import { AccountType, ErrorType } from "db";
import { useCSS, useDB } from "../../hooks";
import LoadBox from "../../components/LoadBox/LoadBox";
import FormInput from "../../components/FormInput/FormInput";
import FormSuggestion from "../../components/FormSuggestion/FormSuggestion";
import FormSelect from "../../components/FormSelect/FormSelect";
import Button from "../../components/Button/Button";

/**
 * Types.
 */
const path = "/account/new/:errorOrSuccess";

const labels = [
  "Email",
  "Password",
  "Confirm password",
  "Firstname",
  "Lastname",
  "City",
  "Region",
];

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
  const { css } = useCSS(({ spacing }) => ({
    form: {
      display: "flex",
      flexFlow: "column",
      alignItems: "flex-end",
      width: "fit-content",
      position: "relative",
      left: `calc(-1em * ${labels[2].length} * 0.33)`,
      margin: `${spacing * 2}px auto 0 auto`,
      whiteSpace: "nowrap",
    },
    button: {
      margin: `0 ${spacing}px 0 0`,
    },
  }));
  const { db } = useDB();
  const history = useHistory();
  const [formState, dispatch] = useReducer(reducer, {
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

  const validate = (
    key: keyof FormState,
    validator: (value: string) => boolean
  ) => {
    return (value: string) => {
      const flag = validator(value);

      if (flag && Object.values(formState).every((value) => value !== "")) {
        setValidated(true);
      } else {
        setValidated(false);
      }

      return flag;
    };
  };

  const handleSubmit = async () => {
    const { email, password, firstName, lastName, city, region } = formState;

    setForceLoad(true);

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

  return (
    <LoadBox data={forceLoad ? undefined : suggestions}>
      <section css={css.form}>
        <FormInput
          type="email"
          label={labels[0]}
          value={formState.email}
          validate={validate("email", validateEmail)}
          onChange={(value) => {
            dispatch({ type: "SET_VALUE", value: { key: "email", value } });
          }}
        />
        <br />
        <FormInput
          type="password"
          label={labels[1]}
          value={formState.password}
          validate={validate(
            "password",
            (value) => value !== "" && value.length > 5
          )}
          onChange={(value) => {
            dispatch({ type: "SET_VALUE", value: { key: "password", value } });
          }}
        />
        <FormInput
          type="password"
          label={labels[2]}
          value={formState.confirmedPassword}
          dependencies={[formState.password]}
          validate={validate(
            "confirmedPassword",
            (value) => value !== "" && formState.password === value
          )}
          onChange={(value) => {
            dispatch({
              type: "SET_VALUE",
              value: { key: "confirmedPassword", value },
            });
          }}
        />
        <br />
        <FormInput
          type="text"
          label={labels[3]}
          value={formState.firstName}
          validate={validate("firstName", (value) => value !== "")}
          onChange={(value) => {
            dispatch({ type: "SET_VALUE", value: { key: "firstName", value } });
          }}
        />
        <FormInput
          type="text"
          label={labels[4]}
          value={formState.lastName}
          validate={validate("lastName", (value) => value !== "")}
          onChange={(value) => {
            dispatch({ type: "SET_VALUE", value: { key: "lastName", value } });
          }}
        />
        <br />
        <FormSuggestion
          label={labels[5]}
          value={formState.city}
          suggestions={suggestions}
          validate={validate("city", (value) => value !== "")}
          onChange={(value) => {
            dispatch({ type: "SET_VALUE", value: { key: "city", value } });
          }}
          onSelect={(value) => {
            dispatch({ type: "SET_VALUE", value: { key: "city", value } });
          }}
        />
        <FormSelect
          label={labels[6]}
          value={formState.region}
          items={regions}
          validate={validate("region", (value) => value !== "")}
          onSelect={(value) => {
            dispatch({ type: "SET_VALUE", value: { key: "region", value } });
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
            {"submit"}
          </Button>
          <Link to="/" tabIndex={-1}>
            <Button> {"cancel"}</Button>
          </Link>
        </div>
      </section>
    </LoadBox>
  );
}

interface FormState {
  email: string;
  password: string;
  confirmedPassword: string;
  firstName: string;
  lastName: string;
  city: string;
  region: string;
  country: string;
}

type Actions = {
  type: "SET_VALUE";
  value: { key: keyof FormState; value: string };
};

const reducer = function reducer(state: FormState, action: Actions) {
  switch (action.type) {
    case "SET_VALUE": {
      return { ...state, [action.value.key]: action.value.value };
    }
    default: {
      throw new Error();
    }
  }
};
