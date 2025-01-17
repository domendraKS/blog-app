import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "./../Firebase";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInFail, signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    //pop-window
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);

      const idToken = await resultFromGoogle.user.getIdToken();

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(signInFail(data.message || "Google login failed"));
      }

      if (data.success) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(
        signInFail(error.message || "An error occurred during Google login")
      );
    }
  };

  return (
    <Button
      className="text-black"
      outline
      gradientDuoTone="pinkToOrange"
      onClick={handleGoogleClick}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          <AiFillGoogleCircle className="w-6 h-6 mr-2" />
          Continue with Google
        </>
      )}
    </Button>
  );
}
