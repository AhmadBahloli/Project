import React, { useState, useEffect, useCallback, useRef } from "react";
import ChatClient from "./chat-client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  makeStyles,
  createStyles,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

const URL = "wss://i0kpn8fw75.execute-api.me-south-1.amazonaws.com/production/";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      "& .MuiPaper-root": {
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: theme.spacing(3),
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        transform: "scale(1.1)",
      },
    },
    dialogTitle: {
      fontWeight: "bold",
      fontSize: "1.25rem",
      textAlign: "center",
    },
    dialogContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    textField: {
      marginTop: theme.spacing(2),
      width: "100%",
    },
    dialogActions: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(2),
    },
    button: {
      background: "linear-gradient(to right, #06b6d4, #0891b2, #0e7490)",
      color: "white",
      textTransform: "none",
      "&:hover": {
        background: "linear-gradient(to bottom right, #0891b2, #0e7490)",
      },
      "&:focus": {
        boxShadow: "0 0 0 4px rgba(34, 211, 238, 0.4)",
      },
      borderRadius: "8px",
      padding: theme.spacing(1, 4),
    },
  })
);

const App = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState([]);
  const [chatRows, setChatRows] = useState<React.ReactNode[]>([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [privateMessageModalOpen, setPrivateMessageModalOpen] = useState(false);
  const [privateMessageRecipient, setPrivateMessageRecipient] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");

  const onSocketOpen = useCallback(() => {
    setShowNameInput(true);
  }, []);

  const onSocketClose = useCallback(() => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);
    setTimeout(() => setLoading(false), 3000); // Stop loading animation 3 seconds after disconnect
  }, []);

  const onSocketMessage = useCallback((dataStr) => {
    const data = JSON.parse(dataStr);
    if (data.members) {
      setMembers(data.members);
    } else if (data.publicMessage) {
      setChatRows((oldArray) => [
        ...oldArray,
        <span>
          <b>{data.publicMessage}</b>
        </span>,
      ]);
    } else if (data.privateMessage) {
      setChatRows((oldArray) => [
        ...oldArray,
        <span>
          <b>{data.privateMessage}</b>
        </span>,
      ]);
    } else if (data.systemMessage) {
      setChatRows((oldArray) => [
        ...oldArray,
        <span>
          <i>{data.systemMessage}</i>
        </span>,
      ]);
    }
  }, []);

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", onSocketClose);
      socket.current.addEventListener("message", (event) => {
        onSocketMessage(event.data);
      });
    }
  }, [onSocketOpen, onSocketClose, onSocketMessage]);

  useEffect(() => {
    return () => {
      socket.current?.close();
    };
  }, []);

  const onSendPrivateMessage = useCallback((to: string) => {
    setPrivateMessageRecipient(to);
    setPrivateMessageModalOpen(true);
  }, []);

  const handleSendPrivateMessage = () => {
    if (privateMessage.trim()) {
      socket.current?.send(
        JSON.stringify({
          action: "sendPrivate",
          message: privateMessage,
          to: privateMessageRecipient,
        })
      );
      setPrivateMessage("");
      setPrivateMessageModalOpen(false);
    }
  };

  const onSendPublicMessage = useCallback(() => {
    if (message.trim()) {
      socket.current?.send(
        JSON.stringify({
          action: "sendPublic",
          message,
        })
      );
      setMessage("");
    }
  }, [message]);

  const onDisconnect = useCallback(() => {
    if (isConnected) {
      socket.current?.close();
      setLoading(true);
    }
  }, [isConnected]);

  const handleNameSubmit = () => {
    if (name.trim()) {
      socket.current?.send(JSON.stringify({ action: "setName", name }));
      setIsConnected(true);
      setShowNameInput(false);
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      onSendPublicMessage();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <ChatClient
        isConnected={isConnected}
        members={members}
        chatRows={chatRows}
        message={message}
        onMessageChange={handleMessageChange}
        onMessageKeyPress={handleKeyPress}
        onPublicMessage={onSendPublicMessage}
        onPrivateMessage={onSendPrivateMessage}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        showNameInput={showNameInput}
        name={name}
        onNameChange={(e) => setName(e.target.value)}
        onNameSubmit={handleNameSubmit}
        loading={loading}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isMobile={isMobile}
      />
      <Dialog
        open={privateMessageModalOpen}
        onClose={() => setPrivateMessageModalOpen(false)}
        className={classes.dialog}
        fullScreen={isMobile}
      >
        <DialogTitle className={classes.dialogTitle}>
          Send Private Message to {privateMessageRecipient}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            fullWidth
            value={privateMessage}
            onChange={(e) => setPrivateMessage(e.target.value)}
            className={classes.textField}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            onClick={() => setPrivateMessageModalOpen(false)}
            className={classes.button}
          >
            Cancel
          </Button>
          <Button onClick={handleSendPrivateMessage} className={classes.button}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
