import React from "react"
import "../styles/styles.css"
import { setCookieBannerCookie } from "../api.js";

export default function Banner({ setShowCookieBanner }) {
    
    async function onClick() {
        setShowCookieBanner(false);
        await setCookieBannerCookie();
    }

    return (
        <div className="inline-flex space-x-2 items-center justify-center bg-primary rounded text-white text-lg px-4">
            <span>
                We use cookies to improve your experience on this site. For more
                information, you can read our{" "}
                <a className="underline" href="https://duotonic.co/privacy-policy">
                Privacy Policy
                </a>
            </span>
            <button onClick={onClick} className="py-2">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </button>
        </div>
    )
}
