import React from "react";

import DynamicFeed from "@material-ui/icons/DynamicFeed";
import Explore from "@material-ui/icons/Explore";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import Group from "@material-ui/icons/Group";
import Bookmarks from "@material-ui/icons/Bookmarks";
import Event from "@material-ui/icons/Event";
import Work from "@material-ui/icons/Work";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <ul className="sidebar__list">
                <li className="sidebar__list-item">
                    <DynamicFeed className="sidebar__list-icon" />
                    <span className="sidebar__list-text">Feed</span>
                </li>
                <li className="sidebar__list-item">
                    <Explore className="sidebar__list-icon" />
                    <span className="sidebar__list-text">Explore</span>
                </li>
                <li className="sidebar__list-item">
                    <PlayCircleFilled className="sidebar__list-icon" />
                    <span className="sidebar__list-text">Videos</span>
                </li>
                <li className="sidebar__list-item">
                    <Group className="sidebar__list-icon" />
                    <span className="sidebar__list-text">Groups</span>
                </li>
                <li className="sidebar__list-item">
                    <Bookmarks className="sidebar__list-icon" />
                    <span className="sidebar__list-text">Bookmarks</span>
                </li>
                <li className="sidebar__list-item">
                    <Event className="sidebar__list-icon" />
                    <span className="sidebar__list-text">Events</span>
                </li>
                <li className="sidebar__list-item">
                    <Work className="sidebar__list-icon" />
                    <span className="sidebar__list-text">Jobs</span>
                </li>
            </ul>
        </div>
    );
}
