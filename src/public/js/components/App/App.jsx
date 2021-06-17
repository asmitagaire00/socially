import React from "react";

import "../../../css/main.css"; // css entry point

import Feed from "../Feed/Feed";
import Header from "../Header";
import Sidebar from "../Sidebar";
import SidebarRight from "../SidebarRight/SidebarRight";

const App = () => {
    return (
        <div className="app">
            <Header />
            <div className="app__main">
                <Sidebar />
                <Feed />
                <SidebarRight />
            </div>
        </div>
    );
};

export default App;
