import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminPaymentSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    upiId: "",
    upiLink: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountHolder: "",
    qrImage: ""
  });
  // ----------------------------
  // LOAD PAYMENT SETTINGS
  // ----------------------------
  useEffect(() => {
    API.get("/payment/settings")
      .then((res) => {
        if (res.data) {
          setForm({
            upiId: res.data.upiId || "",
            upiLink: res.data.upiLink || "",
            bankName: res.data.bankName || "",
            accountNumber: res.data.accountNumber || "",
            ifsc: res.data.ifsc || "",
            accountHolder: res.data.accountHolder || "",
            qrImage: res.data.qrImage || ""
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ----------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------------
  // SAVE SETTINGS (ADMIN)
  // ----------------------------
  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put("/payment/settings", form);
      alert("Payment settings saved successfully");
    } catch (err) {
      console.error(err);
      alert("Admin authentication failed or server error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading payment settings...</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Payment Settings</h1>

      {/* FIRST TIME WARNING */}
      {!form.upiId && !form.bankName && (
        <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800">
          Payment settings not configured yet. Please fill the details below and save.
        </div>
      )}

      {/* QR IMAGE */}
      <div className="mb-6">
        <label className="font-semibold">QR Code Image URL</label>
        <input
          name="qrImage"
          value={form.qrImage}
          onChange={handleChange}
          placeholder="https://res.cloudinary.com/..."
          className="w-full p-3 border rounded mt-2"
        />

        {form.qrImage && form.qrImage.startsWith("http") && (
          <img
            src={form.qrImage}
            alt="QR Preview"
            className="w-40 mt-4 border rounded"
          />
        )}
      </div>

      {/* UPI DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="font-semibold">UPI ID</label>
          <input
            name="upiId"
            value={form.upiId}
            onChange={handleChange}
            placeholder="admin@upi"
            className="w-full p-3 border rounded mt-2"
          />
        </div>

        <div>
          <label className="font-semibold">UPI Payment Link</label>
          <input
            name="upiLink"
            value={form.upiLink}
            onChange={handleChange}
            placeholder="upi://pay?pa=admin@upi&pn=Admin&cu=INR"
            className="w-full p-3 border rounded mt-2"
          />
        </div>
      </div>

      {/* BANK DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="font-semibold">Account Holder Name</label>
          <input
            name="accountHolder"
            value={form.accountHolder}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-2"
          />
        </div>

        <div>
          <label className="font-semibold">Bank Name</label>
          <input
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-2"
          />
        </div>

        <div>
          <label className="font-semibold">Account Number</label>
          <input
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-2"
          />
        </div>

        <div>
          <label className="font-semibold">IFSC Code</label>
          <input
            name="ifsc"
            value={form.ifsc}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-2"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

