import React, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [allEmails, setAllEmails] = useState([]);
  const socialLinks = [
    // { icon: <FaFacebook />, url: "#" },
    // { icon: <FaInstagram />, url: "#" },
    // { icon: <FaTwitter />, url: "#" },
    // {
    //   icon: <FaLinkedin />,
    //   url: "https://www.linkedin.com/in/prashant-hazariwal-71374b212/",
    // },
  ];
  const navLinks = [
    { title: "Home", nav: "#Home" },
    { title: "About", nav: "#About" },
    { title: "Contact", nav: "#Contact" },
  ];
  return (
    <footer
      id="footer"
      className=" text-neutral-800 py-20 px-8 md:px-16 lg:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="footer-section space-y-6">
            <h3 className="text-3xl font-bold ">
              NOCAP
            </h3>
            <p className="text-neutral-600 text-sm">example@gmail.com</p>
          </div>
          <div id="Contact" className="footer-section space-y-6">
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.nav}
                    className="text-neutral-600 hover:text-neutral-800 transition-colors duration-300 relative group"
                  >
                    {link.title}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section space-y-6">
            <h4 className="text-xl font-semibold">Connect</h4>
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="text-neutral-600 hover:text-neutral-800 transition-colors duration-300 transform hover:scale-110"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-section space-y-6">
            <h4 className="text-xl font-semibold">Let's Keep In Touch</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAllEmails((prev) => [...prev, email]);
                toast.success("email saved");
                setEmail("");
              }}
              className="flex flex-col space-y-3"
            >
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="bg-gray-800 text-neutral-200 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-blue-500/85 backdrop-blur-md text-neutral-100 px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-300 text-sm">
          <p className="text-neutral-700 font-semibold">&copy; {new Date().getFullYear()} Prashant All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
