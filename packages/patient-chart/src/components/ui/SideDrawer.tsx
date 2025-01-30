import React, { useState, useEffect } from "react";

// Mui Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: Array<string | { value: string | number; label: string }>;
  value?: string | number;
}

interface SideDrawerProps {
  title: string;
  formFields: FormField[];
  initialData?: { [key: string]: any };
  onSubmit: (data: { [key: string]: any }) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
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

  const handleInputChange = (name: string, value: string | number) => {
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
          position: "absolute",
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
          field.type === "select" ? (
            <FormControl fullWidth key={field.name} sx={{ mb: 2 }}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                label={field.label}
              >
                {field.options?.map((option, index) => {
                  if (typeof option === "string") {
                    return (
                      <MenuItem key={`${field.name}-${index}`} value={option}>
                        {option}
                      </MenuItem>
                    );
                  } else {
                    return (
                      <MenuItem
                        key={`${field.name}-${index}`}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
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

export default SideDrawer;
