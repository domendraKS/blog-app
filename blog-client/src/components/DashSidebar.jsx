import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { MdOutlineCategory } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/userSlice";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  //signout
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });

      if (res.ok) {
        dispatch(signOut());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {currentUser?.user.admin && (
            <>
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={FaChartPie}
                  labelColor={"dark"}
                  as={"div"}
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.user.admin ? "Admin" : "User"}
              labelColor={"dark"}
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.user.admin && (
            <>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  labelColor={"dark"}
                  as={"div"}
                >
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  labelColor={"dark"}
                  as={"div"}
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  labelColor={"dark"}
                  as={"div"}
                >
                  Comments
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=category">
                <Sidebar.Item
                  active={tab === "category"}
                  icon={MdOutlineCategory}
                  labelColor={"dark"}
                  as={"div"}
                >
                  Category
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            className="cursor-pointer"
            icon={HiArrowSmRight}
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
