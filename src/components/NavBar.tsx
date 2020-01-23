import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FaBars, FaUser } from "react-icons/fa";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { navigate } from "@reach/router";
import DialogForm from "./DialogForm";
import ProfileForm from "../forms/ProfileForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

const NavBar = () => {
  const classes = useStyles();
  const { firebase, user } = useFirebaseCtx();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleSignOut = () => {
    firebase.auth().signOut();
    navigate("/");
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const menuId = "primary-search-account-menu";
  const signedInButtons = (
    <>
      <IconButton onClick={handleProfileMenuOpen} color="inherit">
        <FaUser />
      </IconButton>
      <Button onClick={handleSignOut} color="inherit">
        Logout
      </Button>
    </>
  );
  const signedOutButtons = (
    <>
      <Button onClick={() => navigate("/signin")} color="inherit">
        Login
      </Button>
    </>
  );

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={!!anchorEl}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          setDialogOpen(true);
          handleMenuClose();
        }}
      >
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <FaBars />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          {user ? signedInButtons : signedOutButtons}
        </Toolbar>
      </AppBar>
      {renderMenu}
      <DialogForm
        {...{ dialogOpen, setDialogOpen }}
        title="Profile"
        content={<ProfileForm onSuccess={() => setDialogOpen(false)} />}
      />
    </div>
  );
};

export default NavBar;
