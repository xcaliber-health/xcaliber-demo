import React, { useState, useEffect } from "react";

// Mui Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";

interface FormField {
  name: string;
  label: string;
  type: string; // 'text', 'number', 'select', 'date', etc.
  options?: Array<string | { value: string | number; label: string }>;
  value?: string | number;
}

interface PatientSideDrawerProps {
  title: string;
  formFields: FormField[];
  initialData?: { [key: string]: any };
  onSubmit: (data: { [key: string]: any }) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PatientSideDrawer: React.FC<PatientSideDrawerProps> = ({
  title,
  formFields,
  initialData = {},
  onSubmit,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (
      initialData &&
      JSON.stringify(initialData) !== JSON.stringify(formData)
    ) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: "40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "10px",
          height: "100%",
          overflowY: "scroll",
          zIndex: 1500,
        },
      }}
    >
      <div className="flex items-center justify-between p-2">
        <Typography variant="h5">{title}</Typography>
        <IconButton onClick={onClose}>
          <i className="ri-close-line" />
        </IconButton>
      </div>
      <Divider />

      {/* Form Fields */}
      <div style={{ padding: "20px" }}>
        {formFields.map((field) =>
          field.type === "practitioner" ? ( // Check if the field is a practitioner autocomplete
            <FormControl fullWidth key={field.name} sx={{ mb: 2 }}>
              <Autocomplete
                options={field.options || []}
                getOptionLabel={(option: any) =>
                  typeof option === "string" ? option : option.label
                }
                value={
                  field.options?.find(
                    (option: any) => option.value === formData[field.name]
                  ) || null
                }
                onChange={(_, newValue) =>
                  handleInputChange(field.name, newValue?.value || "")
                }
                renderInput={(params) => (
                  <TextField {...params} label={field.label} />
                )}
              />
            </FormControl>
          ) : field.type === "select" ? (
            <FormControl fullWidth key={field.name} sx={{ mb: 2 }}>
  <Autocomplete
    options={field.options || []}
    getOptionLabel={(option: any) =>
      typeof option === "string" ? option : option.label
    }
    value={
      field.options?.find(
        (option: any) => option.value === formData[field.name]
      ) || null
    }
    onChange={(_, newValue) =>
      handleInputChange(field.name, newValue?.value || "")
    }
    renderInput={(params) => (
      <TextField {...params} label={field.label} fullWidth />
    )}
    PaperProps={{
      sx: {
        maxHeight: 150, 
        width: 250, 
        mt: 1, 
      },
    }}
    sx={{
      "& .MuiAutocomplete-input": {
        padding: "8px 12px", 
      },
      "& .MuiAutocomplete-inputRoot": {
        fontSize: "0.875rem", 
      },
    }}
  />
</FormControl>

          ) : (
            <TextField
              key={field.name}
              label={field.label}
              fullWidth
              type={field.type}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              InputLabelProps={{
                shrink: field.type === "date" ? true : undefined,
              }}
              sx={{ marginBottom: 2 }}
            />
          )
        )}

        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ marginRight: "10px" }}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </div>
    </Drawer>
  );
};

export default PatientSideDrawer;
