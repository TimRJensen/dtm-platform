/**
 * Vendor imports.
 */
import { useState, useEffect, FormEvent, MouseEvent, useContext } from "react";
import { useHistory } from "react-router-dom";

/**
 * Custom imports.
 */
import { AccountType, CategoryType, ProfileTable } from "db";
import { useCSS, useDB, useLocale } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";
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
  const { dispatch } = useContext(AppStateContext);
  const history = useHistory();

  console.log(doc);
  if (!doc) {
    dispatch({
      type: "SET_ERROR",
      value: { message: "No results.", code: 404 },
    });
    setTimeout(() => history.push("/error"));

    return null;
  }

  const { locale } = useLocale("dk/DK");
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
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>();
  const [list, setList] = useState<string[]>([]);

  const fetch = async () => {
    const response = await db.select<CategoryType>(
      "main_categories",
      queries.category,
      {}
    );

    if ("error" in response) {
      return;
    }

    setSuggestions(response.map((element) => element.label));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await db.update<ProfileTable>("profiles", {
      id: doc.profileId,
      interests: list,
    });

    if ("error" in response) {
      return;
    }

    setList([]);
    setValue("");
  };

  const handleAdd = (event: MouseEvent) => {
    event.preventDefault();

    if (value !== "") {
      setList([...list, value]);
    }
  };

  const handleRemove = (index: number) => {
    return (event: MouseEvent) => {
      event.preventDefault();
      setList([...list.slice(0, index), ...list.slice(index + 1)]);
    };
  };

  return (
    <section css={css.success}>
      <div css={css.label}>{locale.pages.account.success.emoji}</div>
      <div css={css.text}>
        {locale.pages.account.success.success}
        <br />
        {locale.pages.account.success.verify(doc.email)}
      </div>
      <div css={css.text}>{locale.pages.account.success.wait}</div>
      <form css={css.interestsGroup} onSubmit={handleSubmit}>
        <FormSuggestion
          label="Interests"
          value={value}
          suggestions={suggestions}
          beginIndex={1}
          onChange={(value) => {
            setValue(value);
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
        >{`submit`}</Button>
      </form>
    </section>
  );
}
