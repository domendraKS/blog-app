import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);

  console.log(formData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/post/getPost/${postId}`);

        if (!res.data.success) {
          setPublishError(res.data.message);
          return;
        }

        setFormData(res.data.post);
      } catch (error) {
        console.log(error.message);
      }
    };

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

    if (currentUser?.user.admin) {
      fetchData();
      fetchCategories();
    }
  }, [postId]);

  //handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setPublishError(null);

    const updatedData = new FormData();

    updatedData.append(
      "postDTO",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (file) {
      updatedData.append("postImg", file);
    }

    try {
      const res = await fetch(`/api/post/update/${postId}`, {
        method: "PUT",
        body: updatedData,
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      navigate(`/`);
      // navigate(`/post/${data.post.slug}`);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <>
      <div className="p-3 text-center min-h-screen mx-auto max-w-3xl">
        <h1 className="text-center text-3xl font-semibold my-7">
          Update a Post
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              id="title"
              placeholder="Title"
              required
              className="flex-1"
              onChange={handleChange}
              value={formData.title}
            />
            <Select
              onChange={handleChange}
              id="category"
              value={formData.category}
            >
              <option value="uncategorized">Select a category</option>
              {categories.map((category) => {
                return (
                  <option value={category.name} key={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </Select>
          </div>
          <div className="border-4 border-teal-500 border-dotted p-2">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          {formData.postImg && (
            <img
              src={`http://localhost:3302${formData.postImg}`}
              alt="Uploaded"
              className="w-full h-72 object-cover"
            />
          )}
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-64 mb-12"
            required
            onChange={(value) => setFormData({ ...formData, content: value })}
            value={formData.content}
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Update Post
          </Button>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    </>
  );
};

export default UpdatePost;
