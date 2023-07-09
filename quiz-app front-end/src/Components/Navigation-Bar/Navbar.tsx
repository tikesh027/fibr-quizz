import React, { useState } from "react";
import styles from "../Navigation-Bar/Navbar.module.css";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import BallotIcon from "@mui/icons-material/Ballot";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { Toolbar } from "@mui/material";

const MENU = [
  // {
  //   name: "Home",
  //   icon: HomeRoundedIcon,
  //   path: "/",
  // },
  {
    name: "Quiz List",
    icon: BallotIcon,
    path: "/",
  },
  // {
  //   name: "DashBoard",
  //   icon: ScoreboardIcon,
  //   path: "/dashboard",
  // },
  {
    name: "Question Bank",
    icon: ScoreboardIcon,
    path: "/questions",
  },
];

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { sm: "block" },
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
      }}
      open
    >
      <List>
        {MENU.map((menuItem) => (
          <ListItem key={menuItem.path} disablePadding>
            <ListItemButton
              component={Link}
              className={currentPath === menuItem.path ? styles.activeLink : ""}
              to={menuItem.path}
            >
              <ListItemIcon>
                <menuItem.icon />
              </ListItemIcon>
              <ListItemText primary={menuItem.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Navbar;
