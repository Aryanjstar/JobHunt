"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#24312c" },
    secondary: { main: "#8d4b32" },
    background: { default: "#e7e1d4", paper: "#fbf7f0" },
    text: { primary: "#1c1915", secondary: "#5c564c" },
    divider: "#d9d0c2",
    warning: { main: "#8d4b32" },
  },
  typography: {
    fontFamily: "var(--font-outfit), Helvetica, Arial, sans-serif",
    h1: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 560, letterSpacing: "-0.03em" },
    h2: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 560, letterSpacing: "-0.02em" },
    h3: { fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 560 },
  },
  shape: { borderRadius: 2 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 2, boxShadow: "none" },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#e7e1d4" },
      },
    },
  },
});
