import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const files = [
  "/",
  "/documents/1",
  "/workers/tasks",
  "/writers/tasks",
  "/help",
  "/auth/signUp",
];

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <header className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <Link href="/">
            <a className="btn btn-ghost normal-case text-xl">実験用サイト</a>
          </Link>
        </div>

        <div className="flex-none">
          {process.env.NODE_ENV === "development" && (
            <ul className="menu menu-horizontal p-0">
              {files.map((file) => (
                <li key={file}>
                  <Link href={file}>
                    <a className="btn btn-ghost normal-case text-xl">{file}</a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="footer footer-center h-10 p-4 bg-neutral text-neutral-content">
        <div>
          <p>Copyright © 2022 - All right reserved by unvalley</p>
        </div>
      </footer>
    </div>
  );
};
