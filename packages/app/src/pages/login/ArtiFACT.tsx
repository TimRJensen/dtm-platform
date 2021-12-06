/**
 * Vendor imports.
 */
import { useState, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";

/**
 * Custom imports.
 */
import { useDB, useCSS, useLocale } from "../../hooks";
import Button from "../../components/Button/Button";
import FormInput from "../../components/FormInput/FormInput";

/**
 * Types.
 */
interface Props {}

/**
 * ArtiFACT functional component.
 */
export default function ArtiFACT({}: Props) {
  const { locale } = useLocale("dk/DK");
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
  const history = useHistory();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await db.signIn(email, password);

    if ("error" in response) {
      console.log("sign in error");
      console.log(response.error); //N.B. remove this eventually.
      return;
    }

    history.push("/");
  };

  return (
    <form css={css.form} onSubmit={handleSubmit}>
      <FormInput
        type="email"
        label={locale.pages.login.email}
        value={email}
        onChange={(value) => setEmail(value)}
        onBlur={() => setValidated(email !== "" && password !== "")}
      />
      <br />
      <FormInput
        type="password"
        label={locale.pages.login.password}
        value={password}
        onChange={(value) => setPassword(value)}
        onBlur={() => setValidated(email !== "" && password !== "")}
      />
      <br />
      <div>
        <Button css={css.button} type="accept" disabled={!validated}>
          {locale.components.Button.submit}
        </Button>
        <Link to="/" tabIndex={-1}>
          <Button>{locale.components.Button.submit}</Button>
        </Link>
      </div>
    </form>
  );
}
