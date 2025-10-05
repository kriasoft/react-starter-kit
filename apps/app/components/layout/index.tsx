/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { useState } from "react";
import { HamburgerMenu } from "../HamburgerMenu";
import { Header } from "../Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <main className="pb-safe">
        {children}
      </main>
    </div>
  );
}
