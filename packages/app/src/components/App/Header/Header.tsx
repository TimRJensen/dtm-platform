/**
 * Vendor imports.
 */
import { keyframes } from "@emotion/react";

/**
 * Custom imports.
 */
import { useCSS } from "../../../hooks";
import { Navbar } from "./Navbar/Navbar";
import Gear from "../../../public/gear.svg";
import logo from "../../../public/logo.png";

/**
 * Types.
 */
const rotate = (rotations: number) =>
  keyframes({
    "100%": {
      transform: `rotate(${rotations}turn)`,
    },
  });

const moveX = keyframes({
  "100%": {
    transform: "translateX(0)",
  },
});

/**
 * AppHeader functional component.
 */
export function Header() {
  const { css } = useCSS(({ colors, sizes: { banner } }) => ({
    banner: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: banner.height,
      backgroundColor: "#000",
    },
    gears: {
      minWidth: 80,
      maxWidth: 80,
    },
    gear: {
      position: "relative",
      fill: colors.secondary,
      ":nth-of-type(1)": {
        with: 75,
        height: 75,
        top: 15,
        animation: `${rotate(1)} 10s ease 1s`,
      },
      ":nth-of-type(2)": {
        height: 50,
        with: 50,
        left: -10,
        animation: `${rotate(1.5)} 8.8s ease-in-out reverse 1.2s`,
      },
      ":nth-of-type(3)": {
        height: 30,
        with: 30,
        left: -10,
        top: -15,
        animation: `${rotate(2)} 8s ease 2s`,
      },
    },
    logo: {
      color: colors.text.secondary,
      fontSize: 100,
      ":nth-of-type(3)": {
        width: 430,
        overflow: "hidden",
      },
      "& .image": {
        width: "inherit",
        position: "relative",
        left: -25,
        transform: "translateX(-430px)",
        animation: `${moveX} 6s ease 2s forwards`,
      },
    },
  }));

  return (
    <>
      <div css={css.banner}>
        <div css={css.gears}>
          <Gear css={css.gear} />
          <Gear css={css.gear} />
          <Gear css={css.gear} />
        </div>
        {<div css={css.logo}>|</div>}
        <div css={[css.logo]}>
          <img className="image" src={logo} />
        </div>
      </div>
      <Navbar />
    </>
  );
}
