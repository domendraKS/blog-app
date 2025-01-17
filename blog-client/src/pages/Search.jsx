import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "./../components/PostCard";
import PaginationComp from "../components/PaginationComp";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sortDir: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const orderFromUrl = urlParams.get("sortDir") || "desc";
    const categoryFromUrl = urlParams.get("category") || "uncategorized";

    if (searchTermFromUrl || orderFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sortDir: orderFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();

      try {
        const res = await axios.get(
          `/api/post/getPosts?${searchQuery}&pageNo=${
            currentPageNo - 1
          }&pageSize=12`
        );
        if (!res.data.success) {
          console.log("Something went wrong..!");
          return;
        }
        if (res.data.success) {
          setPosts(res.data.posts);
          setTotalPage(res.data.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search, currentPageNo]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === "sortDir") {
      const sortDir = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sortDir: sortDir });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category: category });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sortDir", sidebarData.sortDir || "desc");
    urlParams.set("category", sidebarData.category || "uncategorized");

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onPageChange = (page) => setCurrentPageNo(page);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/api/category/getAll`);

      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="p-5 border-b md:border-r md:min-h-screen border-gray-500">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">
                Search Term :
              </label>
              <TextInput
                type="text"
                placeholder="Search..."
                id="searchTerm"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label>Order :</label>
              <Select
                onChange={handleChange}
                value={sidebarData.sortDir}
                id="sortDir"
              >
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </Select>
            </div>
            <div className="">
              <label>Category :</label>
              <Select
                onChange={handleChange}
                value={sidebarData.category}
                id="category"
              >
                <option value="uncategorized">Uncategorized</option>
                {categories.map((category) => {
                  return (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  );
                })}
              </Select>
            </div>
            <Button type="submit">Apply</Button>
          </form>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold p-2 sm:border-b border-gray-500">
            Posts results :
          </h1>
          <div className="flex flex-wrap gap-3 p-5">
            {!loading && posts.length === 0 && (
              <p className="text-xl text-gray-500 font-semibold">
                No Post Found
              </p>
            )}
            {loading && <p className="text-xl text-gray-500">Loading...</p>}
            {!loading &&
              posts &&
              posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
          {totalPage > 1 && (
            <PaginationComp
              currentPageNo={currentPageNo}
              totalPage={totalPage}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
