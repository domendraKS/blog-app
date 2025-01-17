import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateCategory = () => {
  const [name, setName] = useState("");
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { categoryId } = useParams();

  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/category/update/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/dashboard?tab=category`);
    } catch (error) {
      console.log(error);
      setPublishError("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/category/get/${categoryId}`);

        if (!res.data.success) {
          setPublishError(res.data.message);
          return;
        }
        setName(res.data.category.name);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [categoryId]);

  return (
    <>
      <div className="p-3 text-center min-h-screen mx-auto max-w-md">
        <h1 className="text-center text-3xl font-semibold my-7">
          Update a Category
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              id="name"
              placeholder="Category name"
              value={name}
              required
              className="flex-1"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button type="submit" gradientDuoTone="purpleToPink">
            Update
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

export default UpdateCategory;
