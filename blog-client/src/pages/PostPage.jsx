import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentsSection from "../components/CommentsSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/post/getPost?slug=${postSlug}`);

        if (!res.data.success) {
          setError(true);
        }

        if (res.data.success) {
          setError(false);
          setPost(res.data.post);
        }
        return;
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const getRecentPosts = async () => {
      try {
        const res = await axios.get("/api/post/getPosts?pageSize=3");
        if (!res.data.success) {
          setError(true);
          return;
        }
        if (res.data.success) {
          setError(false);
          setRecentPosts(res.data.posts);
        }
        return;
      } catch (error) {
        setError(true);
      }
    };
    getRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-5 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="mt-4 self-center"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>

      <img
        // src={post && post.image}
        src={post && `http://localhost:3302${post.postImg}`}
        alt={(post && post.title) || "Blog"}
        className="mt-6 p-3 max-h-[600px] w-full object-cover"
      />

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-4xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      {post && <CommentsSection postId={post.id} />}

      <div className="flex flex-col justify-center items-center my-5 p-1">
        <h1 className="text-xl mt-5">Recent Blogs</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center items-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
