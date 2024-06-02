import React, { useState, useEffect, useCallback, useRef } from "react";
import ChatClient from "./chat-client"; // Import the ChatClient component for rendering the chat interface
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

// WebSocket API Gateway URL (replace with your actual endpoint)
const URL = "wss://i0kpn8fw75.execute-api.me-south-1.amazonaws.com/production/";

// Material-UI styles for custom component appearance
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
  // Get the styled classes from useStyles and the current theme
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is small (mobile)
  const socket = useRef<WebSocket | null>(null); // WebSocket connection (using a ref to preserve the connection across renders)

  // State variables for managing the application
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState([]); // List of chat members
  const [chatRows, setChatRows] = useState<React.ReactNode[]>([]); // Chat messages
  const [message, setMessage] = useState(""); // Current message input
  const [name, setName] = useState(""); // User's name
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle
  const [privateMessageModalOpen, setPrivateMessageModalOpen] = useState(false); // Private message dialog state
  const [privateMessageRecipient, setPrivateMessageRecipient] = useState(""); // Recipient of private message
  const [privateMessage, setPrivateMessage] = useState(""); // Private message content

  // Callback for when the WebSocket connection opens
  const onSocketOpen = useCallback(() => {
    setShowNameInput(true); // Show the name input dialog
  }, []);

  // Callback for when the WebSocket connection closes
  const onSocketClose = useCallback(() => {
    setMembers([]); // Clear the member list
    setIsConnected(false); // Update connection status
    setChatRows([]); // Clear chat messages
    setTimeout(() => setLoading(false), 1500); // Stop loading animation after 1.5 seconds
  }, []);

  // Callback for handling incoming WebSocket messages
  const onSocketMessage = useCallback((dataStr) => {
    const data = JSON.parse(dataStr);
    const timestamp = new Date().toLocaleTimeString(); // Get current time for message display

    // Handle different types of incoming messages
    if (data.members) {
      setMembers(data.members); // Update the member list
    } else if (
      data.publicMessage ||
      data.privateMessage ||
      data.systemMessage ||
      data.media
    ) {
      // (Handle public, private, system, and media messages)
      const message = data.publicMessage ||
        data.privateMessage ||
        data.systemMessage || (
          <img
            src={data.media}
            alt={data.fileName}
            style={{ maxWidth: "100%" }}
          />
        );

      setChatRows((oldArray) => [
        ...oldArray,
        <div
          style={{
            position: "relative",
            padding: "10px",
            boxSizing: "border-box",
          }}
        >
          <span>
            <b>{message}</b>
          </span>
          <span
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              fontSize: "0.8em",
              color: "#888",
            }}
          >
            {timestamp}
          </span>
        </div>,
      ]);
    }
  }, []);

  // Callback to establish a WebSocket connection
  const onConnect = useCallback(() => {
    // Check if a connection already exists and is open
    if (socket.current?.readyState !== WebSocket.OPEN) {
      // Create a new WebSocket instance with the specified URL
      socket.current = new WebSocket(URL);
      // Add event listeners to handle different WebSocket events
      socket.current.addEventListener("open", onSocketOpen); // Handle connection opening
      socket.current.addEventListener("close", onSocketClose); // Handle connection closing
      socket.current.addEventListener("message", (event) => {
        // Handle incoming messages
        onSocketMessage(event.data);
      });
    }
  }, [onSocketOpen, onSocketClose, onSocketMessage]);

  // Cleanup effect to close the WebSocket connection when the component unmounts
  useEffect(() => {
    return () => {
      socket.current?.close();
    };
  }, []);

  // Callback for sending a private message to a specific user
  const onSendPrivateMessage = useCallback((to: string) => {
    setPrivateMessageRecipient(to);
    setPrivateMessageModalOpen(true);
  }, []);

  // Function to handle sending the private message when the user clicks "Send"
  const handleSendPrivateMessage = () => {
    // Check if the message is not empty
    if (privateMessage.trim()) {
      // Send the private message through the WebSocket connection
      socket.current?.send(
        JSON.stringify({
          action: "sendPrivate",
          message: privateMessage,
          to: privateMessageRecipient,
        })
      );
      setPrivateMessage(""); // Clear the private message input
      setPrivateMessageModalOpen(false); // Close the private message dialog
    }
  };

  // Callback for sending a public message to all users in the chat
  const onSendPublicMessage = useCallback(() => {
    // Check if the message is not empty
    if (message.trim()) {
      // Send the public message through the WebSocket connection
      socket.current?.send(
        JSON.stringify({
          action: "sendPublic",
          message,
        })
      );
      setMessage(""); // Clear the public message input
    }
  }, [message]);

  // Callback for disconnecting from the WebSocket
  const onDisconnect = useCallback(() => {
    if (isConnected) {
      // Check if connected
      socket.current?.close(); // Close the WebSocket connection
      setLoading(true); // Show loading animation
    }
  }, [isConnected]);

  // ... (Other functions for handling name input, file uploads, dark mode toggle, etc.)
  const handleNameSubmit = () => {
    if (name.trim()) {
      socket.current?.send(JSON.stringify({ action: "setName", name }));
      setIsConnected(true);
      setShowNameInput(false);
    }
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      onSendPublicMessage();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSendFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        const base64Data = reader.result?.toString().split(",")[1]; // Extract Base64 string
        socket.current.send(
          JSON.stringify({
            action: "sendMedia",
            data: base64Data,
            fileName: file.name,
          })
        );
      }
    };
    reader.readAsDataURL(file);
  };
  // JSX for rendering the chat interface
  return (
    <div>
      {/* Render the ChatClient component and pass props */}
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
        onSendFile={handleSendFile}
      />

      {/* Dialog for sending private messages */}
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
