/**
 * Vendor imports.
 */
import { useState, useEffect, useRef } from "react";

/**
 * Custom imports.
 */
import { AccountType, CategoryType, ProfileTable } from "db";
import { useCSS, useDB } from "../../hooks";
import FormSuggestion from "../../components/FormSuggestion/FormSuggestion";
import FontIcon from "../../components/FontIcon/FontIcon";
import Button from "../../components/Button/Button";

/**
 * Types.
 */
interface Props {
  doc: AccountType | undefined;
}

/**
 * success functional component.
 */
export default function success({ doc }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
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
    button: {
      gridArea: "add",
      alignSelf: "start",
      height: 24,
      width: 24,
      color: colors.secondary,
      "&:hover": {
        color: colors.secondaryDarker,
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
    item: {
      display: "flex",
      alignItems: "center",
    },
  }));
  const { db, queries } = useDB();
  const [data, setData] = useState<string[]>();
  const [list, setList] = useState<string[]>([]);
  const value = useRef("");

  const fetch = async () => {
    const response = await db.select<CategoryType>(
      "main_categories",
      queries.category,
      {}
    );

    if ("error" in response) {
      return;
    }

    setData(response.map((element) => element.label));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSubmit = async () => {
    if (!doc) {
      return;
    }

    const response = await db.update<ProfileTable>("profiles", {
      id: doc.profileId,
      interests: list,
    });

    if ("error" in response) {
      return;
    }

    setList([]);
  };

  const handleAdd = () => {
    if (value.current !== "") {
      setList([...list, value.current]);
    }
  };

  const handleRemove = (index: number) => {
    return () => {
      setList([...list.slice(0, index), ...list.slice(index + 1)]);
    };
  };

  return (
    <section css={css.success}>
      <div css={css.label}>{`(>‿◠)✌`}</div>
      <div css={css.text}>
        {`Your account was succesfully created, but in order to login, it needs to
        be verified.`}
        <br />
        {`An email has been sent to ${doc?.email} with a verification link.`}
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
          onChange={(event) => {
            value.current = event.target.value;
          }}
        />
        <Button css={css.button} type="transparent" onClick={handleAdd}>
          <FontIcon type="add" />
        </Button>
        <div css={css.items}>
          {list.map((item, i) => (
            <div key={`interest-${item}-${i}`} css={css.item}>
              <Button
                css={css.button}
                type="transparent"
                onClick={handleRemove(i)}
              >
                <FontIcon type="remove" />
              </Button>
              {item}
            </div>
          ))}
        </div>
        <Button
          css={css.buttonSubmit}
          type="accept"
          disabled={!list[0]}
          onClick={handleSubmit}
        >{`submit`}</Button>
      </div>
    </section>
  );
}
