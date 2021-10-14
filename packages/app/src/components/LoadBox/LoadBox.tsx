/**
 * Vendor imports
 */

import {
  useState,
  useEffect,
  cloneElement,
  ReactElement,
  Children,
} from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  loadables: any[] | undefined;
  children: ReactElement[] | ReactElement | null;
  once?: boolean;
  fetchOnly?: boolean;
}

/**
 * LoadBox functional component.
 */
export function LoadBox({
  loadables,
  once = true,
  fetchOnly = false,
  children,
}: Props) {
  const { css, theme } = useCSS(({ sizes: { appHeader, banner } }) => ({
    loader: {
      display: "none",
      minHeight: `calc(100vh - ${appHeader.height}px - ${banner.height}px - 30vh)`,
      "&[data-show=true]": {
        display: "flex",
        justifyContent: "center",
        padding: "30vh 0 0 0",
      },
    },
    child: {
      display: "none",
    },
  }));
  const [loaded, setLoaded] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!once) return () => setLoading(true);
    if (fetchOnly && loadables) setLoading(false);
  }, [loadables]);

  useEffect(() => {
    if (!loadables) return;

    if (loaded === loadables.length) {
      setLoading(false);
      setLoaded(0);
    }
  }, [loaded]);

  return (
    <section onLoad={() => setLoaded((loaded) => ++loaded)}>
      <div css={css.loader} data-show={loading}>
        <PacmanLoader color={theme.colors.secondary} />
      </div>
      {children
        ? Children.map(children, (child) =>
            cloneElement(child, {
              ...child.props,
              css: loading ? css.child : child.props.css,
            })
          )
        : null}
    </section>
  );
}
