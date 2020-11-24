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
        ? <a href={process.env.GATSBY_APP_URL} className="ml-2 sm:ml-none text-lg md:text-xl font-semibold text-center rounded bg-primary p-2 hover:bg-primaryDark text-bgColor">
            Start Listening
          </a>
        : null
      }
    </header>
  )
}

export default Header
