import React from "react"
import Header from "../components/header.jsx"
import {Link} from "gatsby"

export default () => {
  return (
    <div className="h-screen bg-bgColor text-textColor flex flex-col">
      <div className="container w-full h-full mx-auto pb-16">
        <Header showButton={false} />
        <div className="flex flex-col items-center justify-center text-center h-full w-full pb-32">
          <span className="text-6xl font-black text-primary">
            404: Page Not Found
          </span>
          <Link to="/" className="text-5xl text-textColor hover:text-primary font-semibold">
            Back to the app
          </Link>
        </div>
      </div>
    </div>
  )
}
