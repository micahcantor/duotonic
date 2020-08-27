import React from "react"
import Icon from "../components/icon.jsx"

const Header = ({ showButton }) => {
  return (
    <header id="header" className="flex justify-between items-center text-2xl w-full h-24 px-2 md:px-none">
      <div className="text-3xl font-black flex items-center">
        <Icon />
        <span>duotonic</span>
      </div>
      { showButton
        ? <a className="ml-2 sm:ml-none text-lg md:text-xl font-semibold text-center rounded bg-primary p-2 hover:bg-primaryDark text-bgColor" href="http://localhost:8080">Start Listening</a>
        : null
      }
    </header>
  )
}

export default Header
