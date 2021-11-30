/**
 * Vendor imports.
 */
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { useDB, useCSS } from "../../hooks";
import Button from "../../components/Button/Button";
import FormInput from "../../components/FormInput/FormInput";
import { AppStateContext } from "../../components/App/app-state/main";

/**
 * Types.
 */
interface Props {}

/**
 * ArtiFACT functional component.
 */
export default function ArtiFACT({}: Props) {
  const { css } = useCSS(({ spacing }) => ({
    form: {
      display: "flex",
      flexFlow: "column",
      alignItems: "flex-end",
      width: "fit-content",
      position: "relative",
      left: `calc(-1em * ${"password".length} * 0.33)`,
      margin: `${spacing * 2}px auto 0 auto`,
      whiteSpace: "nowrap",
    },
    button: {
      margin: `0 ${spacing}px 0 0`,
    },
  }));
  const { db } = useDB();
  const { dispatch } = useContext(AppStateContext);
  const [validated, setValidated] = useState(false);
  const email = useRef("");
  const password = useRef("");

  const handleSubmit = async () => {
    const response = await db.signIn(email.current, password.current);

    if ("error" in response) {
      console.log(response.error); //N.B. remove this eventually.
      return;
    }

    //dispatch({ type: "CURRENT_USER", value: response });
  };

  return (
    <section css={css.form}>
      <FormInput
        type="email"
        label={"Email"}
        onChange={(value) => (email.current = value)}
        onBlur={() =>
          setValidated(email.current !== "" && password.current !== "")
        }
      />
      <br />
      <FormInput
        type="password"
        label={"Password"}
        onChange={(value) => (password.current = value)}
        onBlur={() =>
          setValidated(email.current !== "" && password.current !== "")
        }
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
  );
}
