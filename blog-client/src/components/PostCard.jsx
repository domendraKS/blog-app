import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div
      className="group relative w-full h-[360px] overflow-hidden border border-teal-400
     rounded-lg sm:w-[320px] transition-all"
    >
      <Link to={`/post/${post.slug}`}>
        <img
          // src={post.image}
          src={`http://localhost:3302${post.postImg}`}
          alt={post.slug}
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <h1 className="text-lg font-bold">{post.title}</h1>
        <p className="italic text-sm line-clamp-2">{post.category}</p>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border
           border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all
           duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
        >
          Read Blog
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
