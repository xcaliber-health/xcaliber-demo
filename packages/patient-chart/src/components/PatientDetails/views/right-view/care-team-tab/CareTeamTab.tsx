import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import { fetchCareTeam } from "./fetchCareTeam";

interface CareTeamTabProps {
  id?: string;
}

export interface PractitionerDetails {
  id: string;
  name: string;
  role: string;
  address: string;
  phone: string;
  fax: string;
}

const CareTeamTab = ({ id }: CareTeamTabProps) => {
  const [careTeamMembers, setCareTeamMembers] = useState<PractitionerDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCareTeam(id);
        setCareTeamMembers(response);
      } catch (error) {
        console.error("Error fetching care team list", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderShimmer = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "24px",
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            animation: "pulse 1.5s infinite",
          }}
        >
          {/* Avatar Shimmer */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#e5e7eb",
              marginBottom: "16px",
            }}
          ></div>

          {/* Text Shimmer */}
          <div
            style={{
              height: "16px",
              backgroundColor: "#e5e7eb",
              borderRadius: "8px",
              width: "60%",
              marginBottom: "8px",
            }}
          ></div>
          <div
            style={{
              height: "16px",
              backgroundColor: "#e5e7eb",
              borderRadius: "8px",
              width: "40%",
              marginBottom: "16px",
            }}
          ></div>

          {/* Details Shimmer */}
          <div style={{ width: "100%", textAlign: "center" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: "12px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "6px",
                  width: `${80 - i * 15}%`,
                  margin: "8px auto",
                }}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {loading ? (
        renderShimmer()
      ) : careTeamMembers.length === 0 ? (
        <div
          style={{
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>No care team members available.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
          }}
        >
          {careTeamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                padding: "16px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Avatar Section */}
              <div style={{ textAlign: "center" }}>
                <img
                  alt="Avatar"
                  src="https://s3-alpha-sig.figma.com/img/e0f4/5fcb/04a5be3e74157ed546f35c0cb9e966aa?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MUiROkKJs2d2NhcpPiwsU-hmPDvxloLdOvc~VD73vtkTHbbIu0P8dtAAOifPcDmOotyCYC4owt36171p3gDh5lbq~6wTP4NPQ1oOZ2hN-f18fntlI3yXXGxRuDri037nsA2CBP4vPAKUK36P-krkXGwXF0q3IkKoW~aPUSS8jkKJfJ2ByVWBCAj2WfUeZdTxj~~vw21Gub1hB76OnZdAHX4wt3pu-hm1mHPlSRBt-Jzbyj1eS0HWsW5uX3BBclgOs8xlFZ3QXbhAcFpmMWCzX8QJZDE3KeXX0i7tl06JBNC4AjWNZt3c~qfdf0GyZTIpcoRIsDRO173jksI9mKNVQQ__"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    marginBottom: "16px",
                  }}
                />
                <h2 style={{ fontSize: "1rem", margin: "8px 0" }}>
                  {member.name}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {member.role}
                </p>
              </div>

              {/* Chip Section */}
              <Chip
                label="HFHS Jackson"
                style={{
                  backgroundColor: "#ffe6e6",
                  color: "#e80b0b",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  margin: "8px 0",
                }}
              />

              {/* Details Section */}
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <p>Provider ID: {member.id}</p>
                <p>Phone #: {member.phone}</p>
                <p>Fax: {member.fax}</p>
                <p style={{ fontWeight: "bold", marginTop: "8px" }}>
                  Other provider attributes
                </p>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Address: {member.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CareTeamTab;
