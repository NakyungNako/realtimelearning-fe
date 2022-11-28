import { Paper, InputBase, Divider, IconButton, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import PropTypes from "prop-types";
import { JOIN_URL } from "../../config/config";

export default function CustomizedInputBase({ token }) {
  const link = `${JOIN_URL}${token}`;
  return (
    <Paper
      component="form"
      elevation={0}
      sx={{
        p: "2px 4px",
        marginY: 2,
        display: "flex",
        alignItems: "center",
        border: 1,
      }}
    >
      <InputBase
        disabled
        sx={{ ml: 1, flex: 1 }}
        defaultValue={link}
        inputProps={{
          sx: {
            "&.Mui-disabled": { WebkitTextFillColor: "black" },
          },
        }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <Tooltip title="Copy to Clipboard">
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={() => {
            navigator.clipboard.writeText(link);
          }}
        >
          <ContentCopy />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}

CustomizedInputBase.propTypes = {
  token: PropTypes.string.isRequired,
};
