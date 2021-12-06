/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { ArtifactType } from "db";
import { useCSS, useLocale } from "../../hooks";
import { AppStateContext } from "../App/app-state/main";
import InfoPanel from "../InfoPanel/InfoPanel";
import InfoPanelItem from "../InfoPanelItem/InfoPanelItem";
import Tag from "../Tag/Tag";
import Button from "../Button/Button";
import FontIcon from "../FontIcon/FontIcon";

/**
 * Types.
 */
interface Props {
  doc: ArtifactType | undefined;
  onComment: () => void;
}

/**
 * Artifact functional component.
 */
export default function Artifact({ doc, onComment }: Props) {
  if (!doc) return null;

  const { locale } = useLocale("dk/DK");
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    artifact: {
      display: "grid",
      gridTemplateColumns: `minmax(300px, 1.5fr) minmax(400px, 3fr) minmax(100px, 1fr)`,
      gridTemplateAreas: `
      "title title title" 
      "image content panel"`,
      width: `clamp(768px, 80vw, 100%)`,
      margin: `${2 * spacing}px auto ${2 * spacing}px auto`,
      padding: spacing,
    },
    title: {
      gridArea: "title",
      margin: `0 auto ${2 * spacing}px auto`,
      fontSize: "3rem",
      textAlign: "center",
    },
    image: {
      display: "block",
      gridArea: "image",
      width: "100%",
      borderRadius,
      objectFit: "cover",
    },
    content: {
      gridArea: "content",
      padding: spacing,
      fontSize: "1.25rem",
    },
    button: {
      color: colors.secondary,
      "&:hover": {
        color: colors.secondaryDarker,
      },
    },
    divider: {
      width: "calc(100% - 20px)",
      margin: `${spacing}px 0`,
      borderTop: `1px solid ${colors.primary}`,
    },
  }));
  const { state } = useContext(AppStateContext);

  return (
    <section css={css.artifact}>
      <div css={css.title}>{doc.label}</div>
      <img css={css.image} src={doc.image} />
      <div css={css.content}>{doc.content}</div>
      <InfoPanel>
        <InfoPanelItem title={locale.components.ArtifactPanel.mainCategory}>
          {doc.mainCategory.label}
        </InfoPanelItem>
        <InfoPanelItem title={locale.components.ArtifactPanel.subCategory}>
          {doc.subCategory.label}
        </InfoPanelItem>
        <InfoPanelItem title={locale.components.ArtifactPanel.period}>
          {doc.period.join(" - ")}
        </InfoPanelItem>
        <InfoPanelItem title={locale.components.ArtifactPanel.tags}>
          {doc.tags.map((tag, i) => (
            <Tag key={`${doc.id}-${tag}-${i}`}>{tag}</Tag>
          ))}
        </InfoPanelItem>
        <div css={css.divider}></div>
        <Button
          css={css.button}
          type="transparent"
          onClick={onComment}
          disabled={!state.currentUser}
        >
          <FontIcon type="chat_bubble">
            {locale.components.ArtifactPanel.comment}
          </FontIcon>
        </Button>
      </InfoPanel>
    </section>
  );
}
