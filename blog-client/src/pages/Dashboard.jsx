import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "./../components/DashPosts";
import { useSelector } from "react-redux";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashOverview from "../components/DashOverview";
import DashCategory from "../components/DashCategory";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Dashboard sidebar */}
        <DashSidebar />
      </div>
      {/* Profile */}
      {tab === "profile" && <DashProfile />}
      {tab === "dash" && currentUser.user.admin && <DashOverview />}
      {tab === "posts" && currentUser.user.admin && <DashPosts />}
      {tab === "users" && currentUser.user.admin && <DashUsers />}
      {tab === "comments" && currentUser.user.admin && <DashComments />}
      {tab === "category" && currentUser.user.admin && <DashCategory />}
    </div>
  );
}

export default Dashboard;
