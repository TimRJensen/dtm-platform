/**
 * Vendor imports.
 */
import { Fragment, useState, useEffect, ChangeEvent, FormEvent } from "react";

/**
 * HelloWorld functional component.
 */
interface Props {
  msg: string;
}

export const HelloWorld = function (props: Props) {
  const [msg, setMsg] = useState(props.msg);
  const [input, setInput] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setInput(event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMsg(input);
  };

  useEffect(() => {}, []);

  return (
    <Fragment>
      <h1>{msg}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={handleChange} />
      </form>
    </Fragment>
  );
};
