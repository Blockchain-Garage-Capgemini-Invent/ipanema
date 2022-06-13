import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  PaletteMode,
} from "@mui/material";
import React, { PropsWithChildren, useContext } from "react";

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      light: "#35D07F",
      main: "#009B96",
      dark: "#007088",
      contrastText: "#fff",
    },
    secondary: {
      light: "#FFDA69",
      main: "#FBCC5C",
      dark: "E1B752",
      contrastText: "#000",
    },
  },
});

export const CustomThemeContext = React.createContext<{
  theme?: boolean;
  setTheme: (checked: boolean) => void;
}>({
  theme: undefined,
  setTheme: () => {},
});

export const CustomThemeProvider = (props: PropsWithChildren<{}>) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = React.useState(prefersDarkMode);
  const themeString = (b: boolean) => (b ? "dark" : "light");
  const switchTheme = (checked: boolean) => {
    console.log(checked);
    if (checked === null) setTheme(theme);
    else setTheme(checked);
  };
  const { children } = props;
  const mTheme = React.useMemo(
    () => createTheme(getDesignTokens(themeString(theme))),
    [theme]
  );
  return (
    <CustomThemeContext.Provider
      value={{
        theme,
        setTheme: switchTheme,
      }}
    >
      <ThemeProvider theme={mTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(CustomThemeContext);
