"use client";

import { useEffect } from "react";
import { loadShopState } from "@/lib/shop-storage";

export default function ThemeProvider() {
  useEffect(() => {
    const shopState = loadShopState();
    const themeId   = shopState.equipped.themeId ?? "default";
    if (themeId === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeId);
    }
  }, []);

  return null;
}
