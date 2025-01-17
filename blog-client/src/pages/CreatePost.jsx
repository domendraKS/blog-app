import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublicError] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  //handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPostData = new FormData();

    newPostData.append(
      "postDTO",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    newPostData.append("postImg", file);

    try {
      const res = await fetch("/api/post/savePost", {
        method: "POST",
        body: newPostData,
      });
      const data = await res.json();

      if (!res.ok) {
        setPublicError(data.message);
        return;
      }
      setPublicError(null);
      navigate(`/post/${data.post.slug}`);
    } catch (error) {
      console.log(error);
      setPublicError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="p-3 text-center min-h-screen mx-auto max-w-3xl">
        <h1 className="text-center text-3xl font-semibold my-7">
          Create a Post
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
            />
            <Select onChange={handleChange} id="category">
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

          {formData.image && (
            <img
              src={formData.image}
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
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish
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

export default CreatePost;
