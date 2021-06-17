import React from "react";

import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MailIcon from "@material-ui/icons/Mail";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircle from "@material-ui/icons/AccountCircle";

import AvatarImg from "../../../assets/img/dennis.jpeg";
import SearchBar from "./SearchBar";

export default function Header() {
    return (
        <header>
            <div className="header">
                <div className="header__logo">Socially</div>
                <SearchBar />
                <div className="header__links">
                    <IconButton
                        className="header__icon-btn"
                        aria-label="Show messages"
                        color="inherit"
                    >
                        <Badge badgeContent={3} max={10} color="primary">
                            <MailIcon className="header__icon" />
                        </Badge>
                    </IconButton>
                    <IconButton
                        className="header__icon-btn"
                        aria-label="Show notifications"
                        color="inherit"
                    >
                        <Badge badgeContent={17} max={10} color="primary">
                            <NotificationsIcon className="header__icon" />
                        </Badge>
                    </IconButton>
                    <IconButton
                        className="header__icon-btn"
                        aria-label="Show accounts"
                        color="inherit"
                    >
                        <AccountCircle className="header__icon" />
                    </IconButton>
                    <Avatar
                        alt="Dennis Ritchie"
                        src={AvatarImg}
                        className="header__avatar"
                    />
                </div>
            </div>
        </header>
    );
}
