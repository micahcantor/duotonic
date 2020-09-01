import React from "react"
import { Link } from "gatsby"

const Footer = () => {
    return (
        <footer className="w-full flex flex-col space-y-2 items-center text-lg text-textColor">
            <div className="space-x-4 flex items-center justify-center">
                <Link className="hover:text-primary" to="/terms">Terms</Link>
                <span>•</span>
                <Link className="hover:text-primary" to="/privacy-policy">Privacy Policy</Link>
            </div>
            <span>© 2020 Micah Cantor, Sawyer Pollard</span>
        </footer>
    );
}

export default Footer;