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
  data: any[] | any;
  loadable?: boolean;
  children: ReactElement[] | ReactElement | null;
}

/**
 * LoadBox functional component.
 */
export default function LoadBox({ data, loadable = false, children }: Props) {
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
    if (!loadable && data) {
      setLoading(false);
    }

    return () => {
      if (!loading) {
        setLoading(true);
      }
    };
  }, [data, loading]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (loaded === data.length) {
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
