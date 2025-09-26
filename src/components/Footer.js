// src/components/Footer.js
import React from "react";

const authors = [
  {
    name: "Tejanshu Bhandari [TLxGHOST]",
    github: "https://github.com/TLxGHOST",
  },
 
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-4 mt-8">
      <p className="text-sm">
        Built with ❤️ by{" "}
        {authors.map((author, index) => (
          <span key={author.github}>
            <a
              href={author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {author.name}
            </a>
           
          </span>
        ))}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        © {new Date().getFullYear()} Simulation Of Ant behaviour
      </p>
    </footer>
  );
};

export default Footer;
