const spacing = 16 * 0.6666;
const borderRadius = 10;

// primary: https://coolors.co/002029-00313e-004153-34626f-86a3ac-4c4c4c-eef4ed
// secondary: https://coolors.co/c06000-e07000-ff8000-ffa040-ffc080
// infos: https://coolors.co/d91e36-7ea172-004153-4c4c4c
const colors = {
  primary: "#004153",
  primaryDarker: " #00313E",
  primaryDarkest: "#002029",
  primaryLighter: "#34626F",
  primaryLightest: "#86A3AC",
  secondary: "#FF8000",
  secondaryDarker: "#E07000",
  secondaryDarkest: "#C06000",
  secondaryLighter: "#FFA040",
  secondaryLightest: " #FFC080",
  google: "#ff3d00",
  facebook: "#039be5",
  succes: "#7EA172",
  error: "#D91E36",
  disabled: "#86A3AC",
  text: {
    primary: "#000",
    secondary: " #EEF4ED",
    link: "#0645ad",
    disabled: "rgba(0, 0, 0, 0.2)",
  },
  button: {
    default: "#004153",
    defaultHover: " #00313E",
    defaultDisabled: "rgba(0, 65, 83, 0.2)",
    accept: "#FF8000",
    acceptHover: "#E07000",
    acceptDisabled: "rgba(0, 65, 83, 0.2)",
    transparent: "transparent",
    transparentHover: "transparent",
    transparentDisabled: "transparent",
  },
  tag: {
    default: "#FF8000",
    defaultHover: "#E07000",
  },
  input: {
    default: "",
    defaultBorder: "#004153",
    success: "rgba(126, 161, 114, 0.2)",
    successBorder: "#7EA172",
    error: "rgba(217, 30, 54, 0.2)",
    errorBorder: "#D91E36",
  },
};

const appHeader = {
  height: 50,
  width: "auto",
  controls: {
    height: "inherit",
    width: 100,
  },
};

const gridItem = {
  height: 400,
  width: 300,
};

const banner = {
  height: 200,
  width: "auto",
};

const blog = {
  height: "auto",
  width: 85,
};

const searchBar = {
  height: 35,
  width: 300,
};

const search = {
  height: "auto",
  width: 85,
};

export const button = {
  height: 25,
  width: 90,
  border: 0,
  marginRight: spacing * 0.5,
  borderRadius: borderRadius * 0.5,
  backgroundColor: colors.button.default,
  color: colors.text.secondary,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: colors.button.defaultHover,
  },
};

const theme = {
  spacing,
  borderRadius,
  colors,
  sizes: {
    appHeader,
    gridItem,
    banner,
    blog,
    searchBar,
    search,
  },
  mixins: {
    button,
  },
};

export default theme;
export type Theme = typeof theme;
