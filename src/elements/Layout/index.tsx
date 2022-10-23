import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
}

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
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link href="/help">
                <a>ヘルプ</a>
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="footer footer-center h-10 p-4 bg-neutral text-neutral-content">
        <div>
          <p>Copyright © 2022 - All right reserved by unvalley</p>
        </div>
      </footer>
    </div>
  );
};
