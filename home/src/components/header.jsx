import React from "react"

const Header = ({ showButton }) => {
  return (
    <header
      id="header"
      className="flex justify-between items-center text-2xl w-full h-24"
    >
      <div className="text-3xl font-semibold">duotonic</div>
      { showButton
        ? <a className="text-2xl font-semibold text-center rounded bg-primary p-3 hover:bg-primaryDark text-bgColor" href="http://localhost:8080">Start Listening</a>
        : null
      }
    </header>
  )
}

export default Header
