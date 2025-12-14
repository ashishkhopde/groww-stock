import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { CheckCircle, XCircle, FileText, Loader } from "lucide-react";

export default function KYCDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get(`/admin/kyc/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    }).then((res) => setUser(res.data));
  }, [id]);

  if (!user)
    return (
      <div className="p-10 flex items-center gap-2">
        <Loader className="animate-spin" /> Loading...
      </div>
    );

 const approve = async () => {
  await API.post(`/admin/kyc/approve/${id}`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
  });
  alert("KYC Approved");
  window.location.href = "/admin/kyc";
};

const reject = async () => {
  await API.post(`/admin/kyc/reject/${id}`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
  });
  alert("KYC Rejected");
  window.location.href = "/admin/kyc";
};

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        KYC Details for {user.name}
      </h1>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">

       <div>
  <p className="text-slate-600 text-sm">Phone</p>
  <p>{user.kyc?.mobile}</p>
</div>

<div>
  <p className="text-slate-600 text-sm">Aadhaar</p>
  <p>{user.kyc?.aadhaar}</p>
</div>

<div>
  <p className="text-slate-600 text-sm">PAN</p>
  <p>{user.kyc?.pan}</p>
</div>

<div>
  <p className="text-slate-600 text-sm">Bank Account</p>
  <p>{user.kyc?.bankAccount}</p>
</div>

<div>
  <p className="text-slate-600 text-sm">IFSC</p>
  <p>{user.kyc?.ifsc}</p>
</div>

<div>
  <p className="text-slate-600 text-sm">Date of Birth</p>
  <p>{user.kyc?.dob}</p>
</div>

<div>
  <p className="text-slate-600 text-sm">Address</p>
  <p>{user.kyc?.address}</p>
</div>


        {/* If uploading docs later:
        <img src={user.aadhaarFront} />
        <img src={user.aadhaarBack} />
        <img src={user.panImage} />
        */}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={approve}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg flex items-center gap-2"
        >
          <CheckCircle size={20} /> Approve KYC
        </button>

        <button
          onClick={reject}
          className="px-6 py-3 bg-rose-600 text-white rounded-lg flex items-center gap-2"
        >
          <XCircle size={20} /> Reject KYC
        </button>
      </div>
    </div>
  );
}
