import React from "react";

import SearchIcon from "@material-ui/icons/Search";

export default function SearchBar() {
    return (
        <div className="header__search">
            <input
                className="header__search-input"
                type="text"
                placeholder="Search for posts, friends, etc"
                aria-label="Search for posts, friends, etc"
            />
            <div className="header__icon-wrapper">
                <SearchIcon className="header__search-icon" />
            </div>
        </div>
    );
}
