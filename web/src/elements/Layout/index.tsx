import React from 'react'

type Props = {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <header className="navbar bg-neutral text-neutral-content">
        <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
      </header>
      <main>{children}</main>
      <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
        <div>
          <p>Copyright © 2022 - All right reserved by unvalley</p>
        </div>
      </footer>
    </div>
  )
}
