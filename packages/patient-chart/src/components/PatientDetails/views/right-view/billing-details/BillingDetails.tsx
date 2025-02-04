import Card from "./Card";

const BillingDetails = () => {
  // const data = [
  //   {
  //     title: "Contact Information",
  //     cards: [
  //       {
  //         heading: "John Doe (Default)",
  //         tags: [
  //           {
  //             text: "Home",
  //             bgColor: "bg-purple-100",
  //             textColor: "text-purple-600",
  //           },
  //         ],
  //         content: [
  //           "4135 Parkway Street, Los Angeles, CA, 90017.",
  //           "Mobile: 1234567890",
  //           "Cash / Card on delivery available",
  //         ],
  //       },
  //       {
  //         heading: "Jane Smith",
  //         tags: [
  //           {
  //             text: "Office",
  //             bgColor: "bg-blue-100",
  //             textColor: "text-blue-600",
  //           },
  //         ],
  //         content: [
  //           "555 Office Lane, Los Angeles, CA, 90017.",
  //           "Mobile: 9876543210",
  //           "Available for office hours only",
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     title: "Insurance Information",
  //     cards: [
  //       {
  //         heading: "Blue Cross Blue Shield",
  //         tags: [
  //           {
  //             text: "PPO",
  //             bgColor: "bg-purple-100",
  //             textColor: "text-purple-600",
  //           },
  //         ],
  //         content: [
  //           "Member Name: Seth Hallam",
  //           "Member ID: 142093123",
  //           "Group ID: 1903",
  //           "Payer ID: 901234",
  //           "Deductible: $3000",
  //         ],
  //       },
  //       {
  //         heading: "United HealthCare",
  //         tags: [
  //           {
  //             text: "HMO",
  //             bgColor: "bg-green-100",
  //             textColor: "text-green-600",
  //           },
  //         ],
  //         content: [
  //           "Member Name: John Smith",
  //           "Member ID: 981273645",
  //           "Group ID: 1204",
  //           "Payer ID: 891234",
  //           "Deductible: $2500",
  //         ],
  //       },
  //     ],
  //   },
  // ];
  const data = [];

  return (
    <>
    {data.length === 0 ? (
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
          <p>No billing details available.</p>
          </div>
        ) : (
        <div className="p-6 bg-white min-h-screen rounded-lg">
        data.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-8"
            style={{ marginBottom: "2rem" }}
          >
            <h3
              className="text-lg font-semibold text-gray-700 mb-6"
              style={{ marginBottom: "1.5rem" }}
            >
              {section.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.cards.map((card, cardIndex) => (
                <Card key={cardIndex} card={card} />
              ))}
            </div>
          </div>
        ))
        </div>
      )}
      </>
  );
};

export default BillingDetails;
