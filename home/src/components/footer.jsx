import React from "react"

const Footer = () => {
    return (
        <footer className="w-full flex flex-col space-y-2 items-center text-lg text-textColor">
            <div className="space-x-4 flex items-center justify-center">
                <a className="hover:text-primary" href="">Terms</a>
                <span>•</span>
                <a className="hover:text-primary" href="">Privacy Policy</a>
            </div>
            <span>© 2020 Micah Cantor, Sawyer Pollard</span>
        </footer>
    );
}

export default Footer;