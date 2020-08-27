import React from "react"
import Header from "../components/header.jsx"

export default () => {
    return (
        <div className="h-screen bg-bgDark text-textColor flex flex-col">
            <div className="container w-full h-full mx-auto pb-16">
                <Header showButton={false}/>
                <span className="w-full px-2 text-center text-6xl font-black text-primary mx-auto"> Page not found </span>
            </div>
        </div>
    );
}