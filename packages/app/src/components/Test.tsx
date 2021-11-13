// @ts-nocheck
/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import Dropdown from "./Dropdown/Dropdown";
import ComboBox from "./ComboBox/ComboBox";
import FormInput from "./FormInput/FormInput";
import FormSuggestion from "./FormSuggestion/FormSuggestion";
import FormSelect from "./FormSelect/FormSelect";
import { css } from "@emotion/react";

/**
 * Types.
 */
interface Props {}

/**
 * test functional component.
 */
export default function test({}: Props) {
  return (
    <section style={{ width: 500 }}>
      <Meh>
        <Dropdown css={css({ width: 300 })} label="Test">
          <button
            css={css({ width: 300 })}
            onMouseDown={() => console.log("A")}
          >
            A
          </button>
          <button css={css({ width: 300 })}>B</button>
          <button css={css({ width: 300 })}>C</button>
          <button css={css({ width: 300 })}>D</button>
          <button css={css({ color: "red" })}>E</button>
        </Dropdown>
      </Meh>
      <Meh>
        <div />
      </Meh>
      <br />
      <FormInput label="test" type="text" />
      <br />
      <FormSuggestion
        label="test"
        suggestions={["a", "ab", "abc", "abcd", "abcde"]}
        validate={(value: string) => value !== ""}
      />
      <br />
      <FormSelect
        label="test"
        items={["a", "ab", "abc", "abcd", "abcde"]}
        validate={(value: string) => value !== ""}
      />
    </section>
  );
}

function Meh(children) {
  console.log(children);
  return children.children;
}
