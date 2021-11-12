/**
 * Vendor imports.
 */
import { useState, useEffect, useRef } from "react";
import { Link, useHistory, generatePath } from "react-router-dom";
import { validate as validateEmail } from "email-validator";

/**
 * Custom imports.
 */
import { AccountType, ErrorType } from "db";
import { useCSS, useDB } from "../../hooks";
import LoadBox from "../../components/LoadBox/LoadBox";
import FormInput from "../../components/FormInput/FormInput";
import FormSuggestion, {
  InputType,
} from "../../components/FormSuggestion/FormSuggestion";
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
  "Region Hovedstaden",
  "Region Sjælland",
  "Region Nordjylland",
  "Region Midtjylland",
  "Region Syddanmark",
];

interface Props {
  suggestions: InputType | undefined;
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
      margin: `${spacing * 2}px auto 0 auto`,
      whiteSpace: "nowrap",
    },
    submitButton: {
      margin: `0 ${spacing}px 0 0`,
    },
  }));
  const { db } = useDB();
  const history = useHistory();
  const [forceLoad, setForceLoad] = useState(false);
  const [validated, setValidated] = useState(false);
  const password = useRef("");
  const validating = useRef<string[]>([]);

  const validate = (index: number, validator: (value: string) => boolean) => {
    return (value: string) => {
      const flag = validator(value);

      validating.current[index] = value;

      if (validating.current.every((value) => value !== "")) {
        setValidated(true);
      } else {
        setValidated(false);
      }

      return flag;
    };
  };

  const handleSubmit = async () => {
    const [email, password, , firstName, lastName, city, region] =
      validating.current;

    setForceLoad(true);

    const response = await db.signUp(email, password, {
      firstName,
      lastName,
      city,
      region,
      country: "Denmark",
    });

    if ("error" in response) {
      console.log(response.error); //N.B. remove this eventually.
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
      history.push(
        generatePath(path, {
          errorOrSuccess: "success",
        })
      );
      onSubmit(response);
    }
  };

  useEffect(() => {
    let i = -1;

    while (++i < labels.length) {
      validating.current[i] = "";
    }
  }, []);

  return (
    <LoadBox data={forceLoad ? undefined : suggestions}>
      <section css={css.form}>
        <FormInput
          type="email"
          label={labels[0]}
          validate={validate(0, validateEmail)}
        />
        <br />
        <FormInput
          type="password"
          label={labels[1]}
          onBlur={(value) => {
            password.current = value;
          }}
          validate={validate(1, (value) => value !== "")}
        />
        <FormInput
          type="password"
          label={labels[2]}
          validate={validate(
            2,
            (value) => value !== "" && password.current === value
          )}
        />
        <br />
        <FormInput
          type="text"
          label={labels[3]}
          validate={validate(3, (value) => value !== "")}
        />
        <FormInput
          type="text"
          label={labels[4]}
          validate={validate(4, (value) => value !== "")}
        />
        <br />
        <FormSuggestion
          label={labels[5]}
          suggestions={suggestions}
          validate={validate(5, (value) => value !== "")}
        />
        <FormSelect
          label={labels[6]}
          items={regions}
          validate={validate(6, (value) => value !== "")}
        />
        <br />
        <div>
          <Button
            $css={{ button: css.submitButton }}
            type="accept"
            disabled={!validated}
            onClick={handleSubmit}
          >
            {"Submit"}
          </Button>
          <Link to="/" component={Button}>
            {"Cancel"}
          </Link>
        </div>
      </section>
    </LoadBox>
  );
}
