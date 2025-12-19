import {
  Facebook,
  Instagram,
  Twitter,
  Home,
  Mail
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0F172A] to-[#020617] text-slate-300">

      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* BRAND SECTION */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">
            Grow Stock Capital
          </h2>

          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-white transition">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Useful Links
          </h3>

          <ul className="space-y-3 text-sm">
            <li className="hover:text-white transition cursor-pointer">
              › Home
            </li>
            <li className="hover:text-white transition cursor-pointer">
              › About Us
            </li>
            <li className="hover:text-white transition cursor-pointer">
              › Contact Us
            </li>
            <li className="hover:text-white transition cursor-pointer">
              › Faq
            </li>
            <li className="hover:text-white transition cursor-pointer">
              › Terms and Privacy Policy
            </li>
          </ul>
        </div>

        {/* CONTACT DETAILS */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Contact Details
          </h3>

          <div className="space-y-4 text-sm">

            <div className="flex gap-3">
              <Home size={16} className="mt-1 text-white" />
              <p>
                <span className="font-semibold text-white block">
                  Head Office
                </span>
                City Centre, 2nd Floor,<br />
                Krishna Business Centre,<br />
                Tulsi Vihar Colony, Gwalior,<br />
                Madhya Pradesh 474002
              </p>
            </div>

            <div className="flex gap-3">
              <Mail size={16} className="mt-1 text-white" />
              <p>
                <span className="font-semibold text-white block">
                  Email Address
                </span>
                <a
                  href="mailto:info@growstockcapital.com"
                  className="text-blue-400 hover:underline"
                >
                  info@growstockcapital.com
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-slate-400">
          © Copyright 2018 Grow Stock Capital All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
