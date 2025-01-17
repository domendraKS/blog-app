import { Alert, Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [publishError, setPublicError] = useState(null);
  const navigate = useNavigate();

  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublicError(data.message);
        return;
      }
      setPublicError(null);
      navigate(`/dashboard?tab=category`);
    } catch (error) {
      console.log(error);
      setPublicError("Something went wrong");
    }
  };

  return (
    <>
      <div className="p-3 text-center min-h-screen mx-auto max-w-md">
        <h1 className="text-center text-3xl font-semibold my-7">
          Create a Category
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              id="name"
              placeholder="Category name"
              required
              className="flex-1"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Button type="submit" gradientDuoTone="purpleToPink">
            Create
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

export default CreateCategory;
