/* eslint-disable no-unused-vars */
import React from "react";
import Section from "./Section";
import { socials } from "../constants";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
        <p className="caption text-n-4 lg:block">
          UJENZI LINKING SOLUTIONS © {new Date().getFullYear()}.{" "} <br/>All rights reserved.
        </p>

        <div className="flex items-center gap-5">
          <ul className="flex gap-5 flex-wrap">
            {socials.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${item.title}`}
                className="flex items-center justify-center w-10 h-10 bg-n-8 rounded-full  text-n-7 hover:text-n-5 hover:bg-n-7  transition-colors"
              >
                <img src={item.iconUrl} width={16} height={16} alt={item.title} />
              </a>
            ))}
          </ul>

          {/* Hidden admin icon — blends in with socials */}
          <Link
            to="/admin/registrations"
            title="Admin"
            aria-label="Admin panel"
            className="flex items-center justify-center w-10 h-10 bg-n-8 rounded-full
                       text-n-7 hover:text-n-5 hover:bg-n-7 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default Footer;