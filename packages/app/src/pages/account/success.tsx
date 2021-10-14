/**
 * Vendor imports.
 */
import { useState, useEffect, useContext, useRef } from "react";

/**
 * Custom imports.
 */
import { CategoryType, ProfileTable } from "db";
import { useCSS, useDB } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";
import { LoadBox } from "../../components/LoadBox/LoadBox";
import { FormSuggestion } from "../../components/FormSuggestion/FormSuggestion";
import { FontIcon } from "../../components/FontIcon/FontIcon";
import { Button } from "../../components/Button/Button";

/**
 * Types.
 */
type ResponseType = {
  key: string;
  data: { [key in keyof CategoryType]: any }[];
};

interface Props {
  doc: UserType;
}

/**
 * success functional component.
 */
export default function success({ doc }: Props) {
  const { css } = useCSS(({ spacing }) => ({
    success: {
      display: "flex",
      flexFlow: "column",
      alignItems: "center",
    },
    label: {
      margin: `${spacing * 2}px 0 ${spacing * 4}px 0`,
      fontSize: "3rem",
    },
    text: {
      margin: `0 0 ${spacing * 2}px 0`,
      textAlign: "center",
    },
    interestsGroup: {
      display: "grid",
      gridTemplateAreas: `
        "... ... add"
        "... items ..."
        "... submit ..."
      `,
      gridAutoColumns: `1fr 306px 30px`,
      alignItems: "center",
      fontSize: "1rem",
      "& div:nth-of-type(1)": {
        gridColumn: "span 2",
      },
    },
    buttonAdd: {
      gridArea: "add",
      alignSelf: "start",
      height: 24,
      width: 24,
      backgroundColor: "transparent",
      "&[data-disabled=false]:hover": {
        backgroundColor: "transparent",
      },
    },
    buttonSubmit: {
      gridArea: "submit",
      justifySelf: "end",
    },
    items: {
      gridArea: "items",
      margin: `0 0 ${spacing}px 0`,
      padding: `0 0 0 3px`,
    },
  }));
  const { db, queries } = useDB();
  const { dispatch } = useContext(AppStateContext);
  const [data, setData] = useState<ResponseType>();
  const [list, handleUpdate] = useUpdate<ProfileTable, string[]>(
    "profiles",
    "focus",
    doc
  );
  const value = useRef("");

  const fetch = async () => {
    const response = await db.select<CategoryType>(
      "main_categories",
      queries.category,
      {}
    );

    if (!response) return;

    setData({ key: "label", data: response });
  };

  useEffect(() => {
    fetch();

    console.log(db.currentUser());

    dispatch({
      type: "CURRENT_PATH",
      value: { section: "account", label: "new" },
    });
  }, []);

  return (
    <LoadBox loadables={data?.data} fetchOnly>
      <section css={css.success}>
        <div css={css.label}>{`(>‿◠)✌`}</div>
        <div css={css.text}>
          {`Your account was succesfully created, but in order to login, it needs to
        be verified.`}
          <br />
          {`An email has been sent to ... with a verification link.`}
        </div>
        <div css={css.text}>
          {`While you wait for the email to arrive, consider taking the time to add 
          some of your interests below:
        `}
        </div>
        <div css={css.interestsGroup}>
          <FormSuggestion
            label="Interests"
            suggestions={data}
            beginIndex={1}
            onChange={(_value) => {
              value.current = _value;
            }}
          />
          <Button
            $css={{ button: css.buttonAdd }}
            onClick={() => {
              if (value.current !== "") {
                list([...(list() ?? []), value.current]);
              }
            }}
          >
            <FontIcon type="add" />
          </Button>
          <div css={css.items}>
            {list()
              ? list()!.map((item, i) => (
                  <div key={`interest-${item}-${i}`}>{item}</div>
                ))
              : null}
          </div>
          <Button
            $css={{ button: css.buttonSubmit }}
            type="accept"
            disabled={!list}
            onClick={handleUpdate}
          >{`Submit`}</Button>
        </div>
      </section>
    </LoadBox>
  );
}

import { AllTables, AllTableNames, UserType } from "db";

function useUpdate<T extends AllTables, S extends T[keyof T]>(
  table: AllTableNames,
  field: keyof T,
  doc: UserType
): [(value?: S) => S | undefined, () => Promise<void>] {
  const { db } = useDB();
  const [value, setValue] = useState<S>();

  const handleUpdate = async () => {
    const response = await db.update(table, {
      id: doc.id,
      [field]: value,
    });
  };

  return [
    (_value?: S) => {
      if (!_value) return value;

      setValue(_value);
    },
    handleUpdate,
  ];
}
