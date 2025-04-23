/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Assistant, HelpOutline, NotificationsNone } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { MouseEventHandler, useCallback } from "react";
import { DarkMode, LightMode, useToggleThemeMenu } from "./theme";

const variants = {
  notifications: {
    tooltip: "View notifications",
    icon: <NotificationsNone />,
    useHandleClick,
  },
  assistant: {
    tooltip: "Ask AI assistant",
    icon: <Assistant />,
    useHandleClick,
  },
  help: { tooltip: "Help and support", icon: <HelpOutline />, useHandleClick },
  theme: {
    tooltip: "Change color scheme",
    icon: <ThemeIcon />,
    useHandleClick: useHandleThemeClick,
  },
} as const;

export function ActionButton(props: ActionButtonProps) {
  const { variant, onClick, ...rest } = props;
  const { icon, tooltip, useHandleClick } = variants[variant];
  const handleClick = useHandleClick(onClick);

  return (
    <Tooltip title={tooltip} placement="left" arrow>
      <IconButton size="small" onClick={handleClick} {...rest}>
        {icon}
      </IconButton>
    </Tooltip>
  );
}

function ThemeIcon() {
  const { colorScheme, systemMode } = useColorScheme();
  return (colorScheme ?? systemMode) === "light" ? <DarkMode /> : <LightMode />;
}

function useHandleClick(onClick?: ClickHandler) {
  return useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      onClick?.(event);
    },
    [onClick],
  );
}

function useHandleThemeClick(onClick?: ClickHandler) {
  const toggleThemeMenu = useToggleThemeMenu();
  return useCallback<ClickHandler>(
    (event) => {
      onClick?.(event);
      toggleThemeMenu(event);
    },
    [toggleThemeMenu, onClick],
  );
}

// #region Types

type ClickHandler = MouseEventHandler<HTMLButtonElement>;
interface ActionButtonProps extends IconButtonProps {
  variant: keyof typeof variants;
}

// #endregion
