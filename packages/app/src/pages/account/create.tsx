/**
 * Vendor imports.
 */
import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { validate as validateEmail } from "email-validator";

/**
 * Custom imports.
 */
import { useCSS, useDB } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";
import { LoadBox } from "../../components/LoadBox/LoadBox";
import { FormInput } from "../../components/FormInput/FormInput";
import { FormSuggestion } from "../../components/FormSuggestion/FormSuggestion";
import { FormSelect } from "../../components/FormSelect/FormSelect";
import { Button } from "../../components/Button/Button";

/**
 * Types.
 */
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

type ResponseType = {
  key: string;
  data: { [key: string]: string }[];
};

interface Props {}

/**
 * create functional component.
 */
export default function create({}: Props) {
  const { css } = useCSS(({ spacing }) => ({
    form: {
      display: "flex",
      flexFlow: "column",
      alignItems: "flex-end",
      width: "fit-content",
      margin: `${spacing * 2}px auto 0 auto`,
      whiteSpace: "nowrap",
      //transform: "translateX(-60px)",
    },
    submitButton: {
      margin: `0 ${spacing}px 0 0`,
    },
  }));
  const { db } = useDB();
  const { dispatch } = useContext(AppStateContext);
  const [data, setData] = useState<ResponseType>();
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

  const _fetch = async () => {
    const response = await fetch(
      "https://api.dataforsyningen.dk/steder?hovedtype=Bebyggelse&undertype=by"
    );
    const data = await response.json();

    setData({
      key: "primærtnavn",
      data,
    });
  };

  const handleSubmit = async () => {
    const [email, password, , firstName, lastName, city, region] =
      validating.current;

    const user = await db.signUp(email, password, {
      firstName,
      lastName,
      city,
      region,
      country: "Denmark",
    });
  };

  useEffect(() => {
    let i = -1;

    while (++i < 7) {
      validating.current[i] = "";
    }

    _fetch();

    dispatch({
      type: "CURRENT_PATH",
      value: { section: "account", label: "new" },
    });
  }, []);

  return (
    <LoadBox loadables={data?.data} fetchOnly>
      <section css={css.form}>
        <FormInput
          type="email"
          label={labels[0]}
          validate={validate(0, validateEmail)}
          initial="timrjensen@gmail.com"
        />
        <br />
        <FormInput
          type="password"
          label={labels[1]}
          onBlur={(value) => {
            password.current = value;
          }}
          validate={validate(1, (value) => value !== "")}
          initial="2900Happiness"
        />
        <FormInput
          type="password"
          label={labels[2]}
          validate={validate(
            2,
            (value) => value !== "" && password.current === value
          )}
          initial="2900Happiness"
        />
        <br />
        <FormInput
          type="text"
          label={labels[3]}
          validate={validate(3, (value) => value !== "")}
          initial="Tim"
        />
        <FormInput
          type="text"
          label={labels[4]}
          validate={validate(4, (value) => value !== "")}
          initial="Jensen"
        />
        <br />
        <FormSuggestion
          label={labels[5]}
          suggestions={data}
          validate={validate(5, (value) => value !== "")}
        />
        <FormSelect
          label={labels[6]}
          items={regions}
          validate={validate(6, (value) => value !== "")}
        />
        <br />
        <div>
          <Link
            to="/account/success"
            component={(rest) => (
              <Button
                $css={{ button: css.submitButton }}
                type="accept"
                disabled={!validated}
                onClick={handleSubmit}
                {...rest}
              >
                {"Submit"}
              </Button>
            )}
          ></Link>
          <Link to="/" component={Button}>
            {"Cancel"}
          </Link>
        </div>
      </section>
    </LoadBox>
  );
}
