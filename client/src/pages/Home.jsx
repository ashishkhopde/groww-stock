import React, { useState } from 'react';
import { 
  BarChart4, 
  Menu, 
  X, 
  CheckCircle, 
  TrendingUp, 
  Globe, 
  Mail, 
  Phone 
} from 'lucide-react';
import { Link } from "react-router-dom";
import Trading from '../assets/charts/Trading_chart.png';
import logo from '../assets/charts/logo.png';

// --- Navbar Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Plans", href: "#packages" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white bg-opacity-95 backdrop-blur-sm shadow-lg h-16 flex items-center px-6 md:px-10 lg:px-16 z-50 transition-all duration-300">
        <div className="w-50 h-50 rounded-lg flex items-center justify-center">
        <img src={logo} alt="Financial Chart"  />
        </div>

      {/* Desktop Menu */}
      <div className="ml-auto hidden md:flex items-center gap-8 text-slate-600 font-medium">
        {navLinks.map(link => (
          <a key={link.name} href={link.href} className="hover:text-emerald-600 transition duration-150">
            {link.name}
          </a>
        ))}
        <Link 
          to="/login"
          className="ml-4 px-6 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700"
        >
          Login
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden ml-auto p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-xl flex flex-col p-4 md:hidden">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="py-2 text-slate-700 hover:bg-emerald-50 px-4 rounded-lg" onClick={() => setIsOpen(false)}>
              {link.name}
            </a>
          ))}
          <Link
            to="/login"
            className="mt-4 px-6 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 text-center"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

// --- TickerStrip, Hero, Packages, Footer remain mostly same but CTA updated --- 

const TickerStrip = () => {
  const stocks = [
    { name: "SENSEX", value: "79,212", change: "588", up: false },
    { name: "RELIANCE", value: "1300", change: "5", up: true },
    { name: "TATAMOTORS", value: "654", change: "14", up: false },
    { name: "HDFC", value: "1520", change: "12", up: true },
    { name: "INFOSYS", value: "1402", change: "8", up: true },
    { name: "TCS", value: "3450", change: "20", up: false },
  ];

  return (
    <div className="pt-16 bg-slate-50 border-b border-slate-200 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>

      <div className="flex w-[200%] animate-marquee">
        <div className="flex gap-12 py-2 text-sm px-4">
          {stocks.map((stock, index) => (
            <span 
              key={index} 
              className={`font-medium tracking-wide ${stock.up ? 'text-emerald-600' : 'text-rose-600'} flex items-center gap-1`}
            >
              <TrendingUp size={14} className={stock.up ? 'rotate-0' : 'rotate-180'} />
              {stock.name} {stock.value} {stock.up ? '▲' : '▼'} {stock.change}
            </span>
          ))}
        </div>

        <div className="flex gap-12 py-2 text-sm px-4">
          {stocks.map((stock, index) => (
            <span 
              key={`dup-${index}`} 
              className={`font-medium tracking-wide ${stock.up ? 'text-emerald-600' : 'text-rose-600'} flex items-center gap-1`}
            >
              <TrendingUp size={14} className={stock.up ? 'rotate-0' : 'rotate-180'} />
              {stock.name} {stock.value} {stock.up ? '▲' : '▼'} {stock.change}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Hero = () => (
  <section id="home" className="pt-24 pb-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span className="text-emerald-600 uppercase font-bold text-sm tracking-widest mb-3 block">
          Invest Smarter. Grow Faster.
        </span>
        <h1 className="text-6xl font-extrabold text-slate-900 leading-tight">
          Unlock <span className="text-emerald-600">Exponential</span> Wealth Growth
        </h1>

        <p className="text-slate-600 text-xl mt-6 max-w-lg">
          We provide expert-guided strategies for stocks, mutual funds, and commodities. Simple, transparent, and built for your future.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/register"
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-lg font-semibold shadow-2xl shadow-emerald-500/40 hover:bg-emerald-700 transition transform hover:-translate-y-1"
          >
            Create Free Account
          </Link>

          <a
            href="#packages"
            className="px-8 py-3 bg-white text-slate-800 border-2 border-slate-200 rounded-xl text-lg font-semibold hover:bg-slate-100 transition"
          >
            See Our Plans
          </a>
        </div>
      </div>

      <div className="order-1 md:order-2 relative">
        <img
          src={Trading}
          alt="Financial Chart"
          className="rounded-3xl shadow-2xl shadow-emerald-500/20 w-full h-auto object-cover border-4 border-white"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/059669/ffffff?text=Chart" }}
        />
        <div className="absolute -bottom-8 -left-2 p-4 bg-white rounded-xl shadow-2xl backdrop-blur-sm hidden md:block">
          <p className="text-2xl font-bold text-emerald-500 flex items-center">
            +18.5% <TrendingUp size={24} className="ml-2" />
          </p>
          <p className="text-sm text-slate-500">Avg. Quarterly Return</p>
        </div>
      </div>
    </div>
  </section>
);

const PackageCard = ({ badge, title, price, features, isFeatured, color }) => (
  <div 
    className={`
      p-8 rounded-3xl transition-all duration-300 transform 
      ${isFeatured 
        ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-2xl shadow-emerald-500/50 scale-[1.02] border-4 border-white'
        : 'bg-white text-slate-800 shadow-xl hover:shadow-2xl border border-slate-100'
      }
    `}
  >
    <span className={`${isFeatured ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-700'} px-4 py-1 rounded-full text-sm font-bold tracking-wide`}>
      {badge}
    </span>

    <h3 className={`text-3xl font-bold mt-4 ${isFeatured ? 'text-white' : 'text-slate-900'}`}>{price}</h3>
    <p className={`text-lg font-medium mb-6 ${isFeatured ? 'text-emerald-200' : 'text-slate-500'}`}>{title}</p>

    <ul className={`mt-4 space-y-4 text-sm ${isFeatured ? 'text-emerald-100' : 'text-slate-600'}`}>
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <CheckCircle size={18} className={`${isFeatured ? 'text-white' : 'text-emerald-500'} flex-shrink-0 mt-0.5`} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <button className={`w-full mt-10 py-3 rounded-xl text-lg font-semibold transition transform hover:-translate-y-0.5
      ${isFeatured ? 'bg-white text-emerald-600 hover:bg-slate-100' : 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-700' }
    `}>
      {isFeatured ? 'Start Trading Now' : 'Buy Now'}
    </button>
  </div>
);

const Packages = () => {
  const packagesData = [
    {
      badge: "Standard",
      title: "₹ 25,000 Investment",
      price: "20% ROI",
      features: ["Index Options Focus", "20% Max Return Guarantee", "Monthly Withdrawal Access", "Dedicated Basic Support"],
      isFeatured: false,
      color: "green"
    },
    {
      badge: "Special User",
      title: "₹ 50,000 Investment",
      price: "30% ROI",
      features: ["Index & Futures Trading", "30% Max Return Guarantee", "Daily Withdrawal Access", "Priority Dedicated Support"],
      isFeatured: true,
      color: "emerald"
    },
    {
      badge: "Premium",
      title: "₹ 1,00,000 Investment",
      price: "40% ROI",
      features: ["Stock, Index, & Commodity", "40% Max Return Guarantee", "Lifetime Validity & Daily Withdrawal", "24/7 Expert Analyst Support"],
      isFeatured: false,
      color: "purple"
    },
  ];

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-emerald-600 uppercase font-bold text-sm tracking-widest mb-2 block">
            Pricing
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900">
            Choose Your <span className="text-emerald-600">Investment Package</span>
          </h2>
          <p className="text-lg text-slate-600 mt-4">Transparent plans designed for every stage of your financial growth.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {packagesData.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="contact" className="py-12 bg-slate-900 text-white">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 border-b border-slate-700 pb-8 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <BarChart4 size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Groww Capital</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Leading the way in digital investment strategies for secure and maximized returns.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-4 text-emerald-400">Company</h4>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li><a href="#" className="hover:text-emerald-300 transition">About Us</a></li>
          <li><a href="#" className="hover:text-emerald-300 transition">Careers</a></li>
          <li><a href="#" className="hover:text-emerald-300 transition">Testimonials</a></li>
          <li><a href="#" className="hover:text-emerald-300 transition">Blog</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-4 text-emerald-400">Legal</h4>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li><a href="#" className="hover:text-emerald-300 transition">Terms of Service</a></li>
          <li><a href="#" className="hover:text-emerald-300 transition">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-emerald-300 transition">Risk Disclosure</a></li>
          <li><a href="#" className="hover:text-emerald-300 transition">FAQ</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-4 text-emerald-400">Get In Touch</h4>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li className="flex items-center gap-3">
            <Mail size={16} className="text-emerald-400" />
            <span>angelsmartalgo@gmail.com</span>
          </li>
          <li className="flex items-center gap-3">
            <Globe size={16} className="text-emerald-400" />
            <span>India, Global Offices</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-xs mt-6">
      © {new Date().getFullYear()} Groww Capital – All Rights Reserved. Stock trading involves risk.
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Navbar />
      <TickerStrip />
      <Hero />
      <Packages />
      <Footer />
    </div>
  );
}
