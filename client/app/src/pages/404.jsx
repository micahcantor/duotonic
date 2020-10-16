import React from "react"
import {Link} from "gatsby"

export default () => {
    return (
      <div className="h-screen bg-bgDark text-textColor flex flex-col">
        <div className="container w-full h-full mx-auto pb-16">
          <div className="flex flex-col items-center justify-center text-center h-full w-full p-4 mb-16">
            <span className="text-6xl font-black text-primary">404: Page Not Found</span> 
            <Link to="/" className="text-5xl text-white hover:text-primary font-semibold">Back to the app</Link>
          </div>
        </div>
      </div>
    )
  }