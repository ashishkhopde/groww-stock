import {
  Facebook,
  Instagram,
  Twitter,
  Home,
  Mail
} from "lucide-react";

import { useEffect, useState } from "react";
import API from "../api/axios";
import logo from "../assets/charts/logo.png";

export default function Footer() {

  const [settings, setSettings] = useState({
    address: "",
    email: "",
    mapLink: ""
  });

  const [loading, setLoading] = useState(true);

  // Fetch footer settings
  useEffect(() => {

    const fetchFooter = async () => {
      try {

        const res = await API.get("/admin/footer");

        setSettings({
          address: res.data.address || "",
          email: res.data.email || "",
          mapLink: res.data.mapLink || ""
        });

      } catch (error) {
        console.log("Footer load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();

  }, []);

  return (
    <footer className="bg-gradient-to-b from-[#0F172A] to-[#020617] text-slate-300">

      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* BRAND SECTION */}
        <div>

          <img
            src={logo}
            alt="Grow Stock Capital Logo"
            className="h-20 mb-4"
          />

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
              › FAQ
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

            {/* ADDRESS */}
            <div className="flex gap-3">

              <Home size={40} className="text-white" />

              <p>

                <span className="font-semibold text-white block">
                  Address
                </span>

                <a
                  href={settings.mapLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >

                  {loading
                    ? "Loading..."
                    : settings.address || "Address not available"}

                </a>

              </p>

            </div>


            {/* EMAIL */}
            <div className="flex gap-3">

              <Mail size={16} className="mt-1 text-white" />

              <p>

                <span className="font-semibold text-white block">
                  Email Address
                </span>

                <a
                  href={`mailto:${settings.email}`}
                  className="text-blue-400 hover:underline"
                >

                  {loading
                    ? "Loading..."
                    : settings.email || "Email not available"}

                </a>

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* BOTTOM BAR */}
      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-slate-400">

          © Copyright angelsmartalgo All Rights Reserved.

        </div>

      </div>

    </footer>
  );
}