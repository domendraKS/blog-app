import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaArrowUpLong } from "react-icons/fa6";
import {
  HiAnnotation,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashOverview = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [lastMonthCategories, setLastMonthCategories] = useState(0);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/user/getAllUser?pageSize=5");

      if (!res.data.success) {
        setError(true);
        return;
      }

      if (res.data.success) {
        setUsers(res.data.users);
        setLastMonthUsers(res.data.lastMonthUsers);
        setTotalUsers(res.data.totalUsers);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/post/getPosts?pageSize=5");

      if (!res.data.success) {
        setError(true);
        return;
      }

      if (res.data.success) {
        setPosts(res.data.posts);
        setLastMonthPosts(res.data.lastMonthPosts);
        setTotalPosts(res.data.totalPosts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get("/api/comment/getComments?pageSize=5");

      if (!res.data.success) {
        setError(true);
        return;
      }

      if (res.data.success) {
        setComments(res.data.comments);
        setLastMonthComments(res.data.lastMonthComments);
        setTotalComments(res.data.totalComments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/api/category/getAll?pageSize=5`);

      if (res.data.success) {
        setCategories(res.data.categories);
        setLastMonthCategories(res.data.lastMonthCategory);
        setTotalCategories(res.data.totalCategories);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.user.admin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
      fetchCategories();
    }
  }, [currentUser.user]);

  return (
    <>
      <div className="p-3 md:mx-auto">
        <div className="flex-wrap flex gap-3 justify-center">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <p className="text-md uppercase text-gray-400">Total Users</p>
                <p className="text-2xl">{totalUsers}</p>
              </div>
              <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-2 shadow-lg" />
            </div>
            <div className="flex gap-1 text-sm">
              <span className="text-green-600 ">
                <FaArrowUpLong className="inline" /> {lastMonthUsers}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <p className="text-md uppercase text-gray-400">Total Posts</p>
                <p className="text-2xl">{totalPosts}</p>
              </div>
              <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-2 shadow-lg" />
            </div>
            <div className="flex gap-1 text-sm">
              <span className="text-green-600 ">
                <FaArrowUpLong className="inline" /> {lastMonthPosts}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <p className="text-md uppercase text-gray-400">
                  Total Comments
                </p>
                <p className="text-2xl">{totalComments}</p>
              </div>
              <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-2 shadow-lg" />
            </div>
            <div className="flex gap-1 text-sm">
              <span className="text-green-600 ">
                <FaArrowUpLong className="inline" /> {lastMonthComments}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <p className="text-md uppercase text-gray-400">
                  Total Category
                </p>
                <p className="text-2xl">{totalCategories}</p>
              </div>
              <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-2 shadow-lg" />
            </div>
            <div className="flex gap-1 text-sm">
              <span className="text-green-600 ">
                <FaArrowUpLong className="inline" /> {lastMonthCategories}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 py-3 mx-auto justify-center">
          <div className="flex flex-col w-full lg:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-2 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Users</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to="/dashboard?tab=users">See All</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>User Name</Table.HeadCell>
              </Table.Head>
              {users && (
                <Table.Body className="divide-y">
                  {users.map((user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell className="bg-white dark:bg-gray-800 dark:border-gray-700">
                        <img
                          src={`http://localhost:3302${user.profilePic}`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.name}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
            </Table>
          </div>
          <div className="flex flex-col w-full lg:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-2 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Comments</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to="/dashboard?tab=comments">See All</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Comment By</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              {comments && (
                <Table.Body className="divide-y">
                  {comments.map((comment) => (
                    <Table.Row key={comment.id}>
                      <Table.Cell className="bg-white dark:bg-gray-800 dark:border-gray-700">
                        <p className="line-clamp-3">{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell>{comment.name}</Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
            </Table>
          </div>
          <div className="flex flex-col w-full lg:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-2 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Posts</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to="/dashboard?tab=posts">See All</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>
              {posts && (
                <Table.Body className="divide-y">
                  {posts.map((post) => (
                    <Table.Row key={post.id}>
                      <Table.Cell className="bg-white dark:bg-gray-800 dark:border-gray-700">
                        <img
                          src={`http://localhost:3302${post.postImg}`}
                          alt={post.title}
                          className="w-10 h-10 rounded-md bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{post.title}</Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
            </Table>
          </div>
          <div className="flex flex-col w-full lg:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-2 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Category</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to="/dashboard?tab=category">See All</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Index</Table.HeadCell>
                <Table.HeadCell>Category Name</Table.HeadCell>
              </Table.Head>
              {categories && (
                <Table.Body className="divide-y">
                  {categories.map((category, index) => (
                    <Table.Row key={category.id}>
                      <Table.Cell className="bg-white dark:bg-gray-800 dark:border-gray-700">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell>{category.name}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashOverview;
