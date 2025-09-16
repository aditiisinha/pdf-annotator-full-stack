import React from "react";
import Navbar from "./Navbar";
import "../styles/layout.css";
import "../styles/navbar.css";


export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-container">
        {children}
      </main>
    </>
  );
}
