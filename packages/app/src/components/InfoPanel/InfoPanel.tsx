/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { ArtifactType } from "db";
import { useCSS } from "../../hooks";
import { AppStateContext } from "../App/app-state/main";
import InfoPanelItem from "../InfoPanelItem/InfoPanelItem";
import Tag from "../Tag/Tag";
import Button from "../Button/Button";
import FontIcon from "../FontIcon/FontIcon";

/**
 * Types.
 */
interface Props {
  doc: ArtifactType;
  onComment?: () => void;
}

/**
 * InfoPanel functional component.
 */
export default function InfoPanel({ doc, onComment }: Props) {
  const { state } = useContext(AppStateContext);
  const { css } = useCSS(({ spacing, colors }) => ({
    panel: {
      gridArea: "panel",
      display: "flex",
      flexFlow: "column",
      height: "fit-content",
      borderLeft: `1px solid ${colors.primary}`,
      padding: spacing,
    },
    button: {
      color: colors.secondary,
      "&[data-disabled=false]:hover": {
        color: colors.secondaryDarker,
      },
    },
    divider: {
      width: "calc(100% - 20px)",
      margin: `${spacing}px 0`,
      borderTop: `1px solid ${colors.primary}`,
    },
  }));

  return (
    <div css={css.panel}>
      <InfoPanelItem title="Category:">{doc.mainCategory.label}</InfoPanelItem>
      <InfoPanelItem title="Subcategory:">
        {doc.subCategory.label}
      </InfoPanelItem>
      <InfoPanelItem title="Period:">{doc.period.join(" - ")}</InfoPanelItem>
      <InfoPanelItem title="Tags:">
        {doc.tags.map((tag, i) => (
          <Tag key={`${doc.id}-${tag}-${i}`}>{tag}</Tag>
        ))}
      </InfoPanelItem>
      <div css={css.divider}></div>
      <Button
        $css={{ button: css.button }}
        type="transparent"
        onClick={onComment}
        disabled={!state.currentUser}
      >
        <FontIcon type="chat_bubble">comment</FontIcon>
      </Button>
    </div>
  );
}
