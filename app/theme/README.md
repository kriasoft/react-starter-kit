# Material UI Theme

This folder contains customizations for the `light` and `dark` Material UI themes such as the color of the components, darkness of the surfaces, level of shadow, appropriate opacity of ink elements, etc. It allows to customize all design aspects of the project in order to meet the specific needs of the business or brand.

## Usage Example

For themes to work the top-level React component needs to be wrapped into the `<ThemeProvider>` component (see [`./index.tsx`](../index.tsx)):

```tsx
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./theme/index.js";
import { router } from "./routes/index.js";

const root = ReactDOM.createRoot(document.elementById("root"));

root.render(
  <ThemeProvider>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>,
);
```

How to access the current (selected) theme from under a React component:

```tsx
import { useTheme } from "@mui/material";

function Example(): JSX.Element {
  const theme = useTheme();
  return (...);
}
```

It is also possible to access a specific theme (`light`, `dark`, etc.):

```tsx
import { useTheme } from "./theme/index.js";

function Example(): JSX.Element {
  const theme = useTheme("dark");
  return (...);
}
```

Switch between themes by using `useToggleTheme()` React hook:

```tsx
import { useTheme, useToggleTheme } from "./theme/index.js";

function Example(): JSX.Element {
  const thee = useTheme();
  const toggleTheme = useToggleTheme();

  return (
    <Button onClick={toggleTheme}>
      Switch to {theme.palette.mode === "light" ? "Dark" : "Light"}
    </Button>
  );
}
```

## References

- [Material UI theming](https://mui.com/material-ui/customization/theming/)
- [Material UI default theme viewer](https://mui.com/material-ui/customization/default-theme/) ([source code](https://github.com/mui/material-ui/tree/master/packages/mui-material/src/styles))
- [How to implement UI theme switching (dark mode) with Recoil?](https://github.com/kriasoft/react-starter-kit/discussions/1987)
