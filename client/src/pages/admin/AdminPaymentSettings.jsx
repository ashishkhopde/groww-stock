import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminPaymentSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);

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
        console.log(res.data);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Optional: preview immediately
      setForm((prev) => ({
        ...prev,
        qrImage: URL.createObjectURL(selectedFile)
      }));
    }
  };

  // ----------------------------
  // SAVE SETTINGS (ADMIN)
  // ----------------------------
  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key !== "qrImage") formData.append(key, form[key]);
      });
      if (file) formData.append("logo", file); // backend expects "logo"

      await API.put("/payment/settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Payment settings saved successfully");
    } catch (err) {
      console.error(err);
      alert("Admin authentication failed or server error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading payment settings...</div>;

  return (
    <div className="max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Payment Settings</h1>

      {/* FIRST TIME WARNING */}
      {!form.upiId && !form.bankName && (
        <div className="p-3 mb-4 text-yellow-800 bg-yellow-100 rounded">
          Payment settings not configured yet. Please fill the details below and save.
        </div>
      )}

      {/* QR IMAGE */}
      <div className="mb-6">
        <label className="font-semibold">QR Code Image</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="w-full p-2 mt-2 border-2"
        />

        {form.qrImage && (
          <img
            src={form.qrImage}
            alt="QR Preview"
            className="w-40 mt-4 border rounded"
          />
        )}
      </div>

      {/* UPI DETAILS */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
        <div>
          <label className="font-semibold">UPI ID</label>
          <input
            name="upiId"
            value={form.upiId}
            onChange={handleChange}
            placeholder="admin@upi"
            className="w-full p-3 mt-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">UPI Payment Link</label>
          <input
            name="upiLink"
            value={form.upiLink}
            onChange={handleChange}
            placeholder="upi://pay?pa=admin@upi&pn=Admin&cu=INR"
            className="w-full p-3 mt-2 border rounded"
          />
        </div>
      </div>

      {/* BANK DETAILS */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
        <div>
          <label className="font-semibold">Account Holder Name</label>
          <input
            name="accountHolder"
            value={form.accountHolder}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Bank Name</label>
          <input
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Account Number</label>
          <input
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">IFSC Code</label>
          <input
            name="ifsc"
            value={form.ifsc}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
