export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <h1 className="text-xl font-semibold">Groww Capital</h1>
      </div>

      <div className="hidden md:flex gap-6 text-gray-700 font-medium">
        <a href="#" className="hover:text-blue-600">Home</a>
        <a href="#" className="hover:text-blue-600">Plans</a>
        <a href="#" className="hover:text-blue-600">About</a>
        <a href="#" className="hover:text-blue-600">Contact</a>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Login
      </button>
    </nav>
  );
}
