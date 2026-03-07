import { useEffect, useState } from "react";
import API from "../../api/axios";
import { MapPin, Mail, Link, Save } from "lucide-react";

export default function FooterSettings() {

  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await API.get("/admin/footer");

    setAddress(res.data.address || "");
    setEmail(res.data.email || "");
    setMapLink(res.data.mapLink || "");
  };

  const updateSettings = async () => {

    setLoading(true);

    await API.put("/admin/footer", {
      address,
      email,
      mapLink
    });

    setLoading(false);
    setSuccess("Footer Updated Successfully");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  return (

    <div className="p-8 bg-slate-50 min-h-screen">

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Footer Settings
        </h1>
        <p className="text-slate-500">
          Manage website footer contact details
        </p>
      </div>


      {/* Settings Card */}
      <div className="bg-white rounded-2xl shadow-sm border max-w-2xl p-6 space-y-6">

        {/* Address */}
        <div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <MapPin size={16} /> Address
          </label>

          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter office address"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>





        {/* Email */}
        <div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Mail size={16} /> Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter contact email"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>


        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
            {success}
          </div>
        )}


        {/* Button */}
        <button
          onClick={updateSettings}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Save size={16} />
          {loading ? "Updating..." : "Update Footer"}
        </button>

      </div>

    </div>
  );
}