/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { PostType, CommentType } from "db";
import { useCSS } from "../../hooks";
import { formatDate } from "../../util/main";
import { AppStateContext } from "../App/app-state/main";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
import FontIcon from "../FontIcon/FontIcon";

/**
 * Types.
 */
interface Props {
  doc: PostType | CommentType;
  onEdit: () => void;
}

/**
 * MessageHeader functional component.
 */
export default function MessageHeader({ doc, onEdit }: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    messageHeader: {
      display: "flex",
      alignItems: "center",
      height: `calc(1rem + ${2 * spacing}px)`,
      overflow: "hidden",
      borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
      backgroundColor: colors.primary,
      color: colors.text.secondary,
    },
    link: {
      cursor: "pointer",
    },
    linkDisabled: {
      cursor: "default",
      color: colors.text.disabled,
    },
    info: {
      margin: `0 auto 0 ${spacing}px`,
    },
    dropdown: {
      height: "inherit",
      margin: 0,
      padding: 0,
    },
    items: {
      height: "inherit",
      width: "fit-content",
      margin: 0,
      padding: 0,
    },
    button: {
      height: "inherit",
      backgroundColor: colors.secondary,
      color: colors.text.secondary,
      borderRadius: 0,
      "&[data-disabled=true]": {
        backgroundColor: colors.secondary,
      },
      "&[data-disabled=false]:hover": {
        backgroundColor: colors.secondaryDarker,
      },
    },
    buttonExpand: {
      width: 45,
    },
  }));
  const {
    state: { currentUser },
  } = useContext(AppStateContext);

  return (
    <div css={css.messageHeader}>
      <div css={css.info}>
        {`${formatDate(doc.createdAt)} by `}
        <span>{doc.user.displayName}</span>
      </div>
      <Dropdown
        css={{ ...css }}
        label={
          <Button $css={{ button: [css.button, css.buttonExpand] }}>
            <FontIcon type="more_horiz" />
          </Button>
        }
        disabled={!currentUser}
        direction="left"
      >
        <Button $css={{ ...css }} onClick={onEdit}>
          <FontIcon type="edit">edit</FontIcon>
        </Button>
        <Button $css={{ ...css }} /*onClick={undefined}*/>
          <FontIcon type="delete">delete</FontIcon>
        </Button>
        <Button $css={{ ...css }} /*onClick={undefined}*/>
          <FontIcon type="not_interested">ban</FontIcon>
        </Button>
      </Dropdown>
    </div>
  );
}
