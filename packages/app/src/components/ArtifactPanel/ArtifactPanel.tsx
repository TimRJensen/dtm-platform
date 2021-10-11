/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { ArtifactDocument } from "db";
import { Theme } from "../../themes/dtm";
import { ArtifactInfo } from "../ArtifactInfo/ArtifactInfo";
import { ArtifactTag } from "../ArtifactTag/ArtifactTag";
import { FontIcon } from "../FontIcon/FontIcon";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    colors,
    sizes: { blog },
  } = theme;

  return {
    panel: css({
      display: "flex",
      flexFlow: "column",
      height: "fit-content",
      width: `${blog.width * 0.1}vw`,
      borderLeft: `1px solid ${colors.primary}`,
      padding: spacing,
    }),
    fontIcon: css({
      paddingTop: spacing,
      borderTop: `1px solid ${colors.primary}`,
    }),
  };
};

/**
 * ArtifactPanel functional component.
 */
interface Props {
  doc: ArtifactDocument;
  onComment?: () => void;
  advanced?: boolean;
}

export const ArtifactPanel = function ArtifactPanel({
  doc,
  onComment,
  advanced = true,
}: Props) {
  const css = _css(useTheme() as Theme);

  return (
    <div css={css.panel}>
      <ArtifactInfo title="Category:">{doc.category.base.label}</ArtifactInfo>
      <ArtifactInfo title="Subcategory:">{doc.category.sub.label}</ArtifactInfo>
      <ArtifactInfo title="Period:">{doc.period}</ArtifactInfo>
      {advanced
        ? [
            <ArtifactInfo title="Tags:">
              {doc.tags.map((tag, i) => (
                <ArtifactTag key={`${doc._id}-tag-${tag}-${i}`}>
                  {tag}
                </ArtifactTag>
              ))}
            </ArtifactInfo>,
            <FontIcon
              $css={{ fontIcon: css.fontIcon }}
              type="chat_bubble"
              onClick={onComment}
            >
              comment
            </FontIcon>,
          ]
        : null}
    </div>
  );
};
