/**
 * Vendor imports.
 */
import { useRef, useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";

/**
 * Custom imports.
 */

/**
 * useSearch hook.
 */
export const useSearch = function useSearch() {
  const history = useHistory();
  const [input, setInput] = useState("");
  const domElement = useRef<HTMLInputElement>(null);

  return {
    domElement,
    input: (value?: string) => {
      if (value === undefined) return input;

      setInput(value);
    },
    handleSubmit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setInput("");
      domElement.current?.blur();
      history.push("/search/" + input.trim().split(" ").join("+") + "/page=0");
    },
  };
};
