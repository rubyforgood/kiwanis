import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import logo from "../images/logo.png";
import account from "../images/account.png";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(() => ({
	logo: {
		"&:hover": {
			backgroundColor: "#FFF"
		}
	}
}));

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ResponsiveAppBar = () => {
	const classes = useStyles();
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
	const [activeOne, setActiveOne] = useState("");

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};


	const handleLogoReset = () => {
		setActiveOne("home");
	};

	return (
		<AppBar position="static" elevation={0} style={{ background: "#00FFFF" }}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>

					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							LOGO
						</Typography>
					</Box>

					<Button
						component={Link}
						to={""}
						onClick={handleLogoReset}
						className={classes.logo}>
						<img src={logo} alt="logo" style={{ maxWidth: "25rem", width: "80%" }} />
					</Button>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
						style={{ color: "#000000" }}
					>
						{/* LOGO */}
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								color: "black",
								textDecoration: "none",
							}}
						>
							2022 Blueberry Fundraiser
						</Typography>
					</Box>

					<Box sx={{ flexGrow: 0, display: "inline" }}>

						<Tooltip title="Open settings">
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
								m={0}
								p={0}
							>
								{/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
								<img src={account} alt="account" style={{ width: "50%", maxWidth: "2rem" }} />

								<Button
									sx={{ my: 2, color: "black", display: "block", textTransform: "unset !important" }}>Remy</Button>

								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>

									<ArrowDropDownIcon sx={{ display: { xs: "none", md: "flex" } }} />
								</IconButton>
							</Box>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseUserMenu}>
									<Typography textAlign="center">{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar >
			</Container >
		</AppBar >
	);
};
export default ResponsiveAppBar;
