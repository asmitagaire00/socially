import React from "react";

import AddPost from "../AddPost";
import Post from "../Post";

export default function Feed() {
    return (
        <div className="feed">
            <AddPost />
            <Post />
            <Post />
        </div>
    );
}
