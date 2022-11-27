import { Paper, InputBase, Divider, Button, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export default function EditCustomizedInputBase({
  text,
  tooltip,
  buttonText,
  handleClick,
}) {
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <Paper
      component="form"
      elevation={0}
      sx={{
        p: "2px 4px",
        marginTop: 2,
        display: "flex",
        alignItems: "center",
        border: 1,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={text}
        inputProps={{ "aria-label": text }}
        value={value}
        onChange={handleChange}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <Tooltip title={tooltip}>
        <Button
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={() => handleClick(value)}
        >
          {buttonText}
        </Button>
      </Tooltip>
    </Paper>
  );
}

EditCustomizedInputBase.propTypes = {
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};
