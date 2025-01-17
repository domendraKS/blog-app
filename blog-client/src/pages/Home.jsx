import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "./../components/CallToAction";
import axios from "axios";
import PostCard from "./../components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`/api/post/getPosts?pageSize=6&order=desc`);
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-3 items-start mx-auto my-5 p-4 max-w-3xl text-justify">
        <h1 className="text-3xl font-bold lg:text-5xl">Welcome to my blog!</h1>
        <p className="text-gray-500 text-md sm:text-sm">
          I'm thrilled to have you here. This is a space where I share my
          thoughts, insights, and experiences on various topics that I'm
          passionate about. Whether you're here to learn something new, find
          inspiration, or just explore, I hope you enjoy your time here. Feel
          free to leave your thoughts and engage in the conversation. Happy
          reading.
        </p>
        <Link
          to="/search"
          className="text-md font-bold text-teal-500 hover:text-teal-400 hover:underline"
        >
          View all Posts
        </Link>
      </div>

      <div className="p-4 lg:p-5 bg-amber-300 dark:bg-slate-700 xl:p-5">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto py-5">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-center font-semibold text-2xl">Recent Posts</h2>
            <div className="flex flex-wrap gap-5 mx-auto justify-center items-center">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-center font-bold text-teal-500 hover:text-teal-400 hover:underline"
            >
              View all Posts
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
