const spacing = 16 * 0.6666;
const borderRadius = 10;

//primary: https://coolors.co/002029-00313e-004153-34626f-86a3ac-4c4c4c-eef4ed
//secondary: https://coolors.co/c06000-e07000-ff8000-ffa040-ffc080
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
};

const appHeader = {
  height: 50,
  width: "auto",
  controls: {
    height: "inherit",
    width: 100,
  },
};
const artifact = {
  height: "auto",
  width: 1280,
};

const artifactCard = {
  height: "auto",
  width: 300,
};

const banner = {
  height: 20,
  width: "auto",
};

const blog = {
  height: "auto",
  width: 100,
};

const categoryList = {
  height: `calc(100vh - ${banner.height}vh - ${appHeader.height}px)`,
  width: 12,
};
const searchBar = {
  height: 35,
  width: 300,
};

const search = {
  height: "auto",
  width: 100,
};

const thread = {
  height: "auto",
  width: 40,
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
    artifact,
    artifactCard,
    blog,
    categoryList,
    searchBar,
    search,
    thread,
  },
};

export default theme;
export type Theme = typeof theme;
