import React, { useState } from "react";
import {
  Button,
  Container,
  CssBaseline,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Brightness4, Brightness7 } from "@material-ui/icons";

interface ThemeProps {
  darkMode: boolean;
  isMobile: boolean;
}

const useStyles = makeStyles<Theme, ThemeProps>((theme) =>
  createStyles({
    root: {
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: (props) => (props.darkMode ? "#1a1a1a" : "#a1c4fd"),
      transition: "background-color 0.7s ease",
    },
    container: {
      height: "90%",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[5],
      backgroundColor: (props) => (props.darkMode ? "#2c2c2c" : "#ffffff"),
      padding: theme.spacing(3),
      transition: "background-color 0.5s ease, color 0.5s ease",
      width: (props) => (props.isMobile ? "100%" : "80%"),
    },
    sidebar: {
      backgroundColor: (props) => (props.darkMode ? "#3c3c3c" : "#a1c4fd"),
      color: "white",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      padding: theme.spacing(2),
      transition: "background-color 0.5s ease",
      display: (props) => (props.isMobile ? "none" : "block"),
    },
    chatArea: {
      position: "relative",
      flex: 1,
      background: (props) =>
        props.darkMode
          ? "#4a4a4a"
          : "linear-gradient(90deg, #accbee 0%, #e7f0fd 100%)",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      overflow: "hidden",
      padding: theme.spacing(2),
      transition: "background 0.5s ease",
    },
    list: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      listStyleType: "none",
    },
    listItem: {
      paddingBottom: theme.spacing(1),
      fontWeight: 800,
    },
    button: {
      margin: theme.spacing(1),
      background: "linear-gradient(to right, #06b6d4, #0891b2, #0e7490)",
      color: "white",
      textTransform: "none",
      "&:hover": {
        background: "linear-gradient(to bottom right, #0891b2, #0e7490)",
      },
      "&:focus": {
        boxShadow: "0 0 0 4px rgba(34, 211, 238, 0.4)",
      },
      boxShadow: "0 4px 14px 0 rgba(34, 211, 238, 0.39)",
      borderRadius: "8px",
      fontSize: "0.875rem",
      padding: "10px 20px",
      textAlign: "center",
      transition: "background 0.3s ease, transform 0.3s ease",
    },
    statusIndicator: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      borderRadius: "50%",
    },
    message: {
      backgroundColor: (props) => (props.darkMode ? "#BAD2FF" : "#ffffff"),
      color: "Black",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
      margin: theme.spacing(1, 0),
      maxWidth: "70%",
      transition: "background-color 0.5s ease",
    },
    ownMessage: {
      backgroundColor: (props) => (props.darkMode ? "#eef1f5" : "#eef1f5"),
      color: "Black",
      alignSelf: "flex-end",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
      margin: theme.spacing(1, 0),
      maxWidth: "70%",
      transition: "background-color 0.3s ease",
    },
    loader: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    inputArea: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing(2),
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    messageInputContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem 2rem",
      borderRadius: "0.5rem",
      backgroundColor: "#f9fafb",
      width: "80%",
      transition: "background-color 0.5s ease",
    },
    messageInput: {
      flex: 1,
      padding: "0.75rem 1rem",
      margin: "0 1rem",
      borderRadius: "0.5rem",
      border: "1px solid #d1d5db",
      backgroundColor: "#ffffff",
      fontSize: "0.875rem",
      transition: "background-color 0.5s ease, border-color 0.5s ease",
      resize: "none",  // Prevent resizing
    },
    messageButton: {
      padding: "0.5rem",
      color: "#3b82f6",
      minWidth: "24px",
      minHeight: "24px",
      marginLeft: "8px",
      "& svg": {
        width: "24px",
        height: "24px",
      },
      "&:hover": {
        backgroundColor: "#e0f2fe",
      },
      transition: "background-color 0.5s ease, color 0.5s ease",
    },
    mediaButton: {
      padding: "0.5rem",
      color: "#3b82f6",
      minWidth: "24px",
      minHeight: "24px",
      marginRight: "8px",
      "& svg": {
        width: "24px",
        height: "24px",
      },
      "&:hover": {
        backgroundColor: "#e0f2fe",
      },
      transition: "background-color 0.5s ease, color 0.5s ease",
    },
    centerButtons: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(2),
    },
    nameInputBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(3),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      background: "#a1c4fd",
      boxShadow: theme.shadows[3],
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: (props) => (props.isMobile ? "80%" : "400px"),
      height: "450px",
      textAlign: "center",
    },
    nameInputField: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
      width: "80%",
    },
    darkModeButton: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    googleButton: {
      margin: theme.spacing(1),
      backgroundColor: "white",
      color: "black",
      "&:hover": {
        backgroundColor: "#357ae8",
      },
      width: "80%",
      textTransform: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      textAlign: "center",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    googleIcon: {
      marginRight: theme.spacing(1),
      width: "20px",
      height: "20px",
    },
    appleButton: {
      margin: theme.spacing(1),
      backgroundColor: "black",
      color: "white",
      "&:hover": {
        backgroundColor: "#333333",
      },
      width: "80%",
      textTransform: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      textAlign: "center",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    appleIcon: {
      marginRight: theme.spacing(1),
      width: "20px",
      height: "20px",
    },
  })
);

interface Props {
  isConnected: boolean;
  members: string[];
  chatRows: React.ReactNode[];
  message: string;
  onMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onMessageKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPublicMessage: () => void;
  onPrivateMessage: (to: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  showNameInput: boolean;
  name: string;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNameSubmit: () => void;
  loading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMobile: boolean;
  onSendFile: (file: File) => void; // Add the onSendFile property
}

const ChatClient: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  const [privateMessageAnchorEl, setPrivateMessageAnchorEl] =
    useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleConnect = () => {
    props.onConnect();
  };

  const handleDisconnect = () => {
    props.onDisconnect();
  };

  const handlePrivateMessageClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setPrivateMessageAnchorEl(event.currentTarget);
  };

  const handlePrivateMessageClose = (member: string | null) => {
    setPrivateMessageAnchorEl(null);
    if (member) {
      props.onPrivateMessage(member);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      props.onSendFile(event.target.files[0]);  // Send file immediately after selection
    }
  };

  const handleSendFile = () => {
    if (selectedFile) {
      props.onSendFile(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container style={{ height: "100%" }}>
          <Grid item xs={12} sm={3} className={classes.sidebar}>
            <Typography variant="h6" gutterBottom>
              Members
            </Typography>
            <List component="nav">
              {props.members.map((item) => (
                <ListItem
                  key={item}
                  onClick={() => props.onPrivateMessage(item)}
                  button
                >
                  <ListItemText primary={item} className={classes.listItem} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item container direction="column" xs={12} sm={9}>
            <Paper className={classes.chatArea}>
              <Grid container direction="column" style={{ height: "100%" }}>
                <Grid item style={{ flex: 1, overflowY: "auto" }}>
                  <ul className={classes.list}>
                    {props.chatRows.map((item, i) => (
                      <li
                        key={i}
                        className={
                          i % 2 === 0 ? classes.message : classes.ownMessage
                        }
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Grid>
                {props.isConnected && !props.showNameInput && (
                  <Grid item className={classes.inputArea}>
                    <form
                      className={classes.messageInputContainer}
                      onSubmit={(e) => {
                        e.preventDefault();
                        props.onPublicMessage();
                      }}
                    >
                      <input
                        type="file"
                        style={{ display: "none" }}
                        id="file-input"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-input">
                        <IconButton
                          component="span"
                          className={classes.mediaButton}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                        </IconButton>
                      </label>
                      <textarea
                        id="chat"
                        rows={1}
                        className={classes.messageInput}
                        value={props.message}
                        onChange={props.onMessageChange}
                        onKeyPress={props.onMessageKeyPress}
                        placeholder="Your message..."
                      />
                      <button type="submit" className={classes.messageButton}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                          />
                        </svg>
                        <span className="sr-only"></span>
                      </button>
                    </form>
                  </Grid>
                )}
                <Grid item className={classes.centerButtons}>
                  {props.isConnected && !props.showNameInput ? (
                    <>
                      <Button
                        className={classes.button}
                        variant="contained"
                        size="small"
                        disableElevation
                        onClick={handlePrivateMessageClick}
                      >
                        Private Message
                      </Button>
                      <Menu
                        anchorEl={privateMessageAnchorEl}
                        keepMounted
                        open={Boolean(privateMessageAnchorEl)}
                        onClose={() => handlePrivateMessageClose(null)}
                      >
                        {props.members.map((member) => (
                          <MenuItem
                            key={member}
                            onClick={() => handlePrivateMessageClose(member)}
                          >
                            {member}
                          </MenuItem>
                        ))}
                      </Menu>
                      <Button
                        className={classes.button}
                        variant="contained"
                        size="small"
                        disableElevation
                        onClick={handleDisconnect}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      className={classes.button}
                      variant="contained"
                      size="small"
                      disableElevation
                      onClick={handleConnect}
                    >
                      Join!
                    </Button>
                  )}
                </Grid>
              </Grid>
              <div
                className={classes.statusIndicator}
                style={{
                  backgroundColor: props.isConnected ? "#00da00" : "#e2e2e2",
                }}
              />
              {props.loading && (
                <div className={classes.loader}>
                  <CircularProgress />
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <IconButton
        className={classes.darkModeButton}
        onClick={props.toggleDarkMode}
        color="inherit"
      >
        {props.darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      {props.showNameInput && (
        <Box className={classes.nameInputBox}>
          <Typography variant="h6">Enter your name</Typography>
          <TextField
            className={classes.nameInputField}
            value={props.name}
            onChange={props.onNameChange}
            placeholder="Your name"
            variant="outlined"
            size="small"
            inputProps={{ style: { textAlign: 'center' } }}
          />
          <Button
            className={classes.googleButton}
            variant="contained"
            size="small"
            disableElevation
          >
            <svg
              className={classes.googleIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#4285F4"
                d="M24 9.5c3.13 0 5.9 1.07 8.08 2.85l6.02-6.03C34.91 3.23 29.73 1 24 1 14.36 1 6.09 6.73 2.92 15.01l7.43 5.76C12.41 13.59 17.73 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.18 24.49C46.18 23.36 46.09 22.24 45.96 21.15H24v8.19h12.67c-.56 2.92-2.18 5.37-4.66 7.05l7.43 5.76c4.35-4.01 6.74-9.93 6.74-16.66z"
              />
              <path
                fill="#FBBC05"
                d="M9.35 28.24C8.5 25.33 8.5 22.67 9.35 19.76L1.92 14.01C-.34 18.91-.34 25.09 1.92 30l7.43-5.76z"
              />
              <path
                fill="#EA4335"
                d="M24 46.5c5.74 0 10.55-1.89 14.08-5.11l-7.43-5.76c-2.07 1.38-4.69 2.18-7.65 2.18-6.27 0-11.59-4.09-13.65-9.79L2.92 30c3.18 8.27 11.45 14 21.08 14z"
              />
            </svg>
            Sign in with Google
          </Button>
          <Button
            className={classes.appleButton}
            variant="contained"
            size="small"
            disableElevation
          >
            <svg
              className={classes.appleIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path d="M36.55 23.78c-.05-5.05 4.1-7.5 4.27-7.63-2.33-3.41-5.95-3.88-7.23-3.93-3.07-.32-6 1.84-7.57 1.84-1.55 0-3.95-1.79-6.49-1.74-3.34.05-6.42 1.94-8.14 4.93-3.47 5.98-.88 14.8 2.49 19.64 1.66 2.42 3.63 5.14 6.23 5.03 2.5-.1 3.44-1.62 6.46-1.62 3.03 0 3.82 1.62 6.48 1.57 2.68-.04 4.37-2.47 6-4.91 1.9-2.78 2.69-5.5 2.74-5.65-.06-.03-4.98-1.93-5.03-7.61zM30.98 9.74c1.32-1.6 2.21-3.82 1.97-6.05-1.9.08-4.22 1.26-5.6 2.83-1.23 1.43-2.3 3.74-2.01 5.94 2.14.17 4.32-1.13 5.64-2.72z" />
            </svg>
            Sign in with Apple
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            size="small"
            disableElevation
            onClick={props.onNameSubmit}
          >
            Join!
          </Button>
        </Box>
      )}
    </div>
  );
};

export default ChatClient;
