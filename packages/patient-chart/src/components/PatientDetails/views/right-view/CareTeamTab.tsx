// Mui Imports
import Chip from "@mui/material/Chip";

interface CareTeamTabProps {
  id?: string;
}

const CareTeamTab = ({ id }: CareTeamTabProps) => {
  return (
    <div className="flex justify-between">
      <div
        style={{ width: "32%" }}
        className="p-6 shadow-lg rounded-lg h-full bg-white overflow-hidden justify-center"
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <img
            alt="Avatar"
            src="https://s3-alpha-sig.figma.com/img/e0f4/5fcb/04a5be3e74157ed546f35c0cb9e966aa?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MUiROkKJs2d2NhcpPiwsU-hmPDvxloLdOvc~VD73vtkTHbbIu0P8dtAAOifPcDmOotyCYC4owt36171p3gDh5lbq~6wTP4NPQ1oOZ2hN-f18fntlI3yXXGxRuDri037nsA2CBP4vPAKUK36P-krkXGwXF0q3IkKoW~aPUSS8jkKJfJ2ByVWBCAj2WfUeZdTxj~~vw21Gub1hB76OnZdAHX4wt3pu-hm1mHPlSRBt-Jzbyj1eS0HWsW5uX3BBclgOs8xlFZ3QXbhAcFpmMWCzX8QJZDE3KeXX0i7tl06JBNC4AjWNZt3c~qfdf0GyZTIpcoRIsDRO173jksI9mKNVQQ__"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              marginTop: "16px",
            }}
          />
          <div>
            <h2 className="text-lg font-medium my-2">Mark Gilbert</h2>
            <p className="text-md mb-2">Primary Care Provider</p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-2">
            <Chip
              label="HFHS Wyandotte"
              size="small"
              sx={{
                backgroundColor: "#8A8D9329",
                color: "#8A8D93",
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            />
          </div>
        </div>

        {/* Details Section */}
        <div
          style={{ marginTop: "24px" }}
          className="flex flex-col items-center font-medium"
        >
          <p>Provider ID: 124535 </p>
          <p>Phone #: a3e28y423 </p>
          <p>other provider</p>
          <p> attributes</p>
        </div>
      </div>
      <div
        style={{ width: "32%" }}
        className="p-6 shadow-lg rounded-lg h-full bg-white overflow-hidden justify-center"
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <img
            alt="Avatar"
            src="https://s3-alpha-sig.figma.com/img/e0f4/5fcb/04a5be3e74157ed546f35c0cb9e966aa?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MUiROkKJs2d2NhcpPiwsU-hmPDvxloLdOvc~VD73vtkTHbbIu0P8dtAAOifPcDmOotyCYC4owt36171p3gDh5lbq~6wTP4NPQ1oOZ2hN-f18fntlI3yXXGxRuDri037nsA2CBP4vPAKUK36P-krkXGwXF0q3IkKoW~aPUSS8jkKJfJ2ByVWBCAj2WfUeZdTxj~~vw21Gub1hB76OnZdAHX4wt3pu-hm1mHPlSRBt-Jzbyj1eS0HWsW5uX3BBclgOs8xlFZ3QXbhAcFpmMWCzX8QJZDE3KeXX0i7tl06JBNC4AjWNZt3c~qfdf0GyZTIpcoRIsDRO173jksI9mKNVQQ__"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              marginTop: "16px",
            }}
          />
          <div>
            <h2 className="text-lg font-medium my-2">Eugenia Parsons</h2>
            <p className="text-md mb-2">Opthamologist</p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-2">
            <Chip
              label="HFHS Jackson"
              size="small"
              sx={{
                backgroundColor: "#FFCDD2",
                color: "#D32F2F",
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            />
          </div>
        </div>

        {/* Details Section */}
        <div
          style={{ marginTop: "24px" }}
          className="flex flex-col items-center font-medium"
        >
          <p>Provider ID: 124535 </p>
          <p>Phone #: a3e28y423 </p>
          <p>other provider</p>
          <p> attributes</p>
        </div>
      </div>
      <div
        style={{ width: "32%" }}
        className="p-6 shadow-lg rounded-lg h-full bg-white overflow-hidden justify-center"
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <img
            alt="Avatar"
            src="https://s3-alpha-sig.figma.com/img/e0f4/5fcb/04a5be3e74157ed546f35c0cb9e966aa?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MUiROkKJs2d2NhcpPiwsU-hmPDvxloLdOvc~VD73vtkTHbbIu0P8dtAAOifPcDmOotyCYC4owt36171p3gDh5lbq~6wTP4NPQ1oOZ2hN-f18fntlI3yXXGxRuDri037nsA2CBP4vPAKUK36P-krkXGwXF0q3IkKoW~aPUSS8jkKJfJ2ByVWBCAj2WfUeZdTxj~~vw21Gub1hB76OnZdAHX4wt3pu-hm1mHPlSRBt-Jzbyj1eS0HWsW5uX3BBclgOs8xlFZ3QXbhAcFpmMWCzX8QJZDE3KeXX0i7tl06JBNC4AjWNZt3c~qfdf0GyZTIpcoRIsDRO173jksI9mKNVQQ__"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              marginTop: "16px",
            }}
          />
          <div>
            <h2 className="text-lg font-medium my-2">Francis Byrd</h2>
            <p className="text-md mb-2">Nurse</p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-2">
            <Chip
              label="HFHS Jackson"
              size="small"
              sx={{
                backgroundColor: "#FFCDD2",
                color: "#D32F2F",
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            />
          </div>
        </div>

        {/* Details Section */}
        <div
          style={{ marginTop: "24px" }}
          className="flex flex-col items-center font-medium"
        >
          <p>Provider ID: 124535 </p>
          <p>Phone #: a3e28y423 </p>
          <p>other provider</p>
          <p> attributes</p>
        </div>
      </div>
    </div>
  );
};

export default CareTeamTab;
