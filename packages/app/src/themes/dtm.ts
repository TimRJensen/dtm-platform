const theme = {
  spacing: 16 * 0.6666,
  borderRadius: 10,
  colors: {
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
    text: {
      primary: "#000",
      secondary: " #EEF4ED",
      link: "#0645ad",
      disabled: " #86A3AC",
    },
    button: {
      default: "#004153",
      defaultHover: " #00313E",
      accept: "#FF8000",
      acceptHover: "#E07000",
    },
    fontIcon: {
      default: "#86A3AC",
      defaultActive: "#FF8000",
      defaultHover: "#E07000",
    },
    tag: {
      default: "#FF8000",
      defaultHover: "#E07000",
    },
  },
  sizes: {
    appHeader: {
      height: 50,
      width: "auto",
      controls: {
        height: "inherit",
        width: 100,
      },
    },
    artifact: {
      height: "auto",
      width: 1280,
    },
    artifactCard: {
      height: "auto",
      width: 300,
    },
    blog: {
      height: "auto",
      width: 100,
    },
    categoryList: {
      height: "auto",
      width: 200,
    },
    searchBar: {
      height: 35,
      width: 400,
    },
    searchView: {
      height: "auto",
      width: 650,
    },
    thread: {
      height: "auto",
      width: 40,
    },
  },
};

export const button = {
  height: 25,
  width: 90,
  border: 0,
  marginRight: theme.spacing * 0.5,
  borderRadius: theme.borderRadius * 0.5,
  backgroundColor: theme.colors.button.default,
  color: theme.colors.text.secondary,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.colors.button.defaultHover,
  },
};

export default theme;
export type Theme = typeof theme;
