import React from "react"
import { Link } from "gatsby"
import Icon from "../components/icon.jsx"

const Header = ({ showButton }) => {
  return (
    <header id="header" className="flex justify-between items-center text-2xl w-full p-2 md:px-none">
      <div className="flex items-center">
        <Icon />
        <Link to="/" className="text-3xl font-black">duotonic</Link>
      </div>
      { showButton
        ? <a className="ml-2 sm:ml-none text-lg md:text-xl font-semibold text-center rounded bg-primary p-2 hover:bg-primaryDark text-bgColor" href="http://localhost:8080">Start Listening</a>
        : null
      }
    </header>
  )
}

export default Header
