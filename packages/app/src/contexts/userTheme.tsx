import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { PropsWithChildren, useContext } from "react";

const getDarkTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle farthest-corner at top left, rgba(0, 0, 0, 0.10) 0%, rgba(0, 155, 150, 0.5) 50%),\n" +
            "radial-gradient(circle farthest-corner at bottom right, rgba(225, 183, 82, 1) 0%, rgba(0, 0, 0, 0.5) 50%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(0,0,0,.5)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(0,0,0,.5)",
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      light: "#35D07F",
      main: "#009B96",
      dark: "#007088",
      contrastText: "#fff",
    },
    secondary: {
      light: "#FFDA69",
      main: "#FBCC5C",
      dark: "#E1B752",
      contrastText: "#000000",
    },
  },
});

const getLightTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle farthest-corner at top left, rgba(255, 255, 255, 1) 0%, rgba(0, 155, 150, 0.5) 50%),\n" +
            "radial-gradient(circle farthest-corner at bottom right, rgba(225, 183, 82, 1) 0%, rgba(255, 255, 255, 0.5) 50%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,.5)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,.5)",
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      light: "#35D07F",
      main: "#009B96",
      dark: "#007088",
      contrastText: "#fff",
    },
    secondary: {
      light: "#FFDA69",
      main: "#FBCC5C",
      dark: "#E1B752",
      contrastText: "#000000",
    },
  },
});

export const CustomThemeContext = React.createContext<{
  theme?: boolean;
  setTheme: (checked: boolean) => void;
}>({
  theme: undefined,
  setTheme: () => undefined,
});

export const CustomThemeProvider = (props: PropsWithChildren<unknown>) => {
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
    () => (themeString(theme) === "dark" ? getDarkTheme : getLightTheme),
    [theme],
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
