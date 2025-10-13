
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import { createClaim } from "../api/claims";
import { Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast"; // ✅ Toast notifications

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400"
    />
  );
}

export default function NewClaim() {
  const navigate = useNavigate();
  const { sourceId, setLatestCurl } = useContext(AppContext);

  // Options
  const patientOptions = ["12345"];
  const departmentOptions = [101];
  const providerOptions = ["9876", "54321", "67890", "98765"];
  const procedureCodeOptions = ["99213", "93000"];
  const icd10Options = ["M54.50"];
  const customFieldOptions = [{ customfieldid: "CF-100", optionid: "OPT-1", value: "Value A" }];
  const insuranceOptions = ["Coverage/PRIM-001", "Coverage/SEC-002"];
  const referralAuthOptions = [445566];

  // State
  const [patientId, setPatientId] = useState(patientOptions[0]);
  const [departmentId, setDepartmentId] = useState(departmentOptions[0]);
  const [supervisingProviderId, setSupervisingProviderId] = useState(providerOptions[0]);
  const [referringProviderId, setReferringProviderId] = useState(providerOptions[1]);
  const [orderingProviderId, setOrderingProviderId] = useState(providerOptions[2]);
  const [renderingProviderId, setRenderingProviderId] = useState(providerOptions[3]);
  const [primaryInsuranceId, setPrimaryInsuranceId] = useState(insuranceOptions[0]);
  const [secondaryInsuranceId, setSecondaryInsuranceId] = useState(insuranceOptions[1]);
  const [referralAuthId, setReferralAuthId] = useState(referralAuthOptions[0]);
  const [serviceDate, setServiceDate] = useState("2025-01-11");

  const [claimCharges, setClaimCharges] = useState([
    { procedurecode: procedureCodeOptions[0], unitamount: 15000, allowableamount: 12000, allowablemin: 10000, allowablemax: 13000, linenote: "Primary procedure", icd10code1: icd10Options[0] },
    { procedurecode: procedureCodeOptions[1], unitamount: 10000, allowableamount: 0, allowablemin: 0, allowablemax: 0, linenote: "", icd10code1: "" }
  ]);

  const [customFields, setCustomFields] = useState([
    { customfieldid: customFieldOptions[0].customfieldid, optionid: customFieldOptions[0].optionid, customfieldvalue: customFieldOptions[0].value }
  ]);

  const [loading, setLoading] = useState(false);

  // Submit handler
  const handleSubmit = async () => {
    const body = {
      patientid: patientId,
      departmentid: Number(departmentId),
      supervisingproviderid: supervisingProviderId,
      referringproviderid: referringProviderId,
      orderingproviderid: orderingProviderId,
      renderingproviderid: renderingProviderId,
      primarypatientinsuranceid: primaryInsuranceId,
      secondarypatientinsuranceid: secondaryInsuranceId,
      referralauthid: Number(referralAuthId),
      servicedate: serviceDate,
      claimcharges: claimCharges,
      customfields: customFields,
      patient: { reference: `Patient/${patientId}` },
      departmentId: { reference: `departmentId/${departmentId}` },
      extension: [{ url: "http://xcaliber-fhir/structureDefinition/department-id", valueString: `${departmentId}` }]
    };

    try {
      setLoading(true);
      const saved = await createClaim(body, sourceId, setLatestCurl);
      setLoading(false);

      if (saved?.id) {
        toast.success(`✅ Claim successfully created (ID: ${saved.id})`);
        navigate(`/claims/${saved.id}`);
      } else {
        toast.error("Failed to create claim: invalid response from server");
      }
    } catch (err) {
      setLoading(false);
      toast.error(`Failed to create claim: ${err.message}`);
    }
  };

  const totalBilled = claimCharges.reduce((sum, c) => sum + c.unitamount, 0);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">New Claim</h1>
          <p className="text-sm text-gray-600">Fill the form and submit the claim</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 overflow-auto">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">

            {/* Patient & Department */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Patient ID</label>
                <select value={patientId} onChange={e => setPatientId(e.target.value)} className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full">
                  {patientOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Department ID</label>
                <select value={departmentId} onChange={e => setDepartmentId(e.target.value)} className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full">
                  {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Providers */}
            <div className="grid md:grid-cols-2 gap-4">
              {[{label:"Supervising Provider", val: supervisingProviderId, set: setSupervisingProviderId},
                {label:"Referring Provider", val: referringProviderId, set:setReferringProviderId},
                {label:"Ordering Provider", val: orderingProviderId, set:setOrderingProviderId},
                {label:"Rendering Provider", val: renderingProviderId, set:setRenderingProviderId}].map((p, idx) => (
                <div key={idx}>
                  <label className="block font-medium mb-1">{p.label}</label>
                  <select value={p.val} onChange={e => p.set(e.target.value)} className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full">
                    {providerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Insurances & Referral */}
            <div className="grid md:grid-cols-2 gap-4">
              {[{label:"Primary Insurance", val:primaryInsuranceId, set:setPrimaryInsuranceId, options:insuranceOptions},
                {label:"Secondary Insurance", val:secondaryInsuranceId, set:setSecondaryInsuranceId, options:insuranceOptions},
                {label:"Referral Authorization", val:referralAuthId, set:setReferralAuthId, options:referralAuthOptions}].map((f, idx) => (
                <div key={idx}>
                  <label className="block font-medium mb-1">{f.label}</label>
                  <select value={f.val} onChange={e=>f.set(e.target.value)} className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full">
                    {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block font-medium mb-1">Service Date</label>
                <Input type="date" value={serviceDate} onChange={e=>setServiceDate(e.target.value)} />
              </div>
            </div>

            {/* Claim Charges */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Claim Charges</h2>
              {claimCharges.map((c, idx) => (
                <div key={idx} className="grid md:grid-cols-6 gap-2 mb-2">
                  <select value={c.procedurecode} onChange={e=>setClaimCharges(claimCharges.map((v,i)=>i===idx?{...v, procedurecode:e.target.value}:v))} className="border-2 border-gray-200/50 py-2 px-3 rounded-2xl">
                    {procedureCodeOptions.map(pc => <option key={pc} value={pc}>{pc}</option>)}
                  </select>
                  <Input type="number" placeholder="Unit Amount" value={c.unitamount} onChange={e=>setClaimCharges(claimCharges.map((v,i)=>i===idx?{...v, unitamount:Number(e.target.value)}:v))} />
                  <Input type="number" placeholder="Allowable Amount" value={c.allowableamount} onChange={e=>setClaimCharges(claimCharges.map((v,i)=>i===idx?{...v, allowableamount:Number(e.target.value)}:v))} />
                  <Input type="number" placeholder="Min" value={c.allowablemin} onChange={e=>setClaimCharges(claimCharges.map((v,i)=>i===idx?{...v, allowablemin:Number(e.target.value)}:v))} />
                  <Input type="number" placeholder="Max" value={c.allowablemax} onChange={e=>setClaimCharges(claimCharges.map((v,i)=>i===idx?{...v, allowablemax:Number(e.target.value)}:v))} />
                  <select value={c.icd10code1} onChange={e=>setClaimCharges(claimCharges.map((v,i)=>i===idx?{...v, icd10code1:e.target.value}:v))} className="border-2 border-gray-200/50 py-2 px-3 rounded-2xl">
                    <option value="">-- ICD10 --</option>
                    {icd10Options.map(icd => <option key={icd} value={icd}>{icd}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Custom Fields */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Custom Fields</h2>
              {customFields.map((c, idx)=>(

                <div key={idx} className="grid md:grid-cols-3 gap-2 mb-2">
                  <select value={c.customfieldid} onChange={e=>setCustomFields(customFields.map((v,i)=>i===idx?{...v, customfieldid:e.target.value}:v))} className="border-2 border-gray-200/50 py-2 px-3 rounded-2xl">
                    {customFieldOptions.map(f => <option key={f.customfieldid} value={f.customfieldid}>{f.customfieldid}</option>)}
                  </select>
                  <select value={c.optionid} onChange={e=>setCustomFields(customFields.map((v,i)=>i===idx?{...v, optionid:e.target.value}:v))} className="border-2 border-gray-200/50 py-2 px-3 rounded-2xl">
                    {customFieldOptions.map(f => <option key={f.optionid} value={f.optionid}>{f.optionid}</option>)}
                  </select>
                  <Input placeholder="Value" value={c.customfieldvalue} onChange={e=>setCustomFields(customFields.map((v,i)=>i===idx?{...v, customfieldvalue:e.target.value}:v))} />
                </div>

              ))}
            </div>

            {/* Total & Submit */}
            <div className="flex justify-between items-center mt-4">
              <div className="font-medium">Total Billed: ${totalBilled.toFixed(2)}</div>
              <Button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-40 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Submit Claim"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
}
