import { Avatar, Tooltip } from "@mui/material";
import React from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../../config/ChatLogics";
import useAuth from "../../../../hooks/useAuth";

export default function ScrollableChat({ messages }) {
  const { auth } = useAuth();
  return (
    messages &&
    messages.map((m, i) => (
      <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
        {(isSameSender(messages, m, i, auth.id) ||
          isLastMessage(messages, i, auth.id)) && (
          <Tooltip title={m.sender.username} placement="bottom-start" arrow>
            <Avatar
              sx={{ mr: 1, mt: "7px", height: 35, width: 35 }}
              cursor="pointer"
              alt={m.sender.username}
              src={m.sender.picture}
            />
          </Tooltip>
        )}

        <span
          style={{
            backgroundColor: `${
              m.sender._id === auth.id ? "#BEE3F8" : "#B9F5D0"
            }`,
            marginLeft: isSameSenderMargin(messages, m, i, auth.id),
            marginTop: isSameUser(messages, m, i, auth.id) ? 4 : 10,
            marginRight: 8,
            borderRadius: "20px",
            padding: "5px 15px",
            maxWidth: "75%",
          }}
        >
          {m.content}
        </span>
      </div>
    ))
  );
}
