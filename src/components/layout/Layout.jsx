import React from "react";
import Header from "./DynamicHeader";
import { Layout } from "lucide-react";

function Layout({ children, currentPage, onNavigate }) {
  return (
    <div className="layout">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
