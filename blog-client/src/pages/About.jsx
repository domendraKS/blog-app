import React from "react";

function About() {
  return (
    <>
      <div className="flex flex-col justify-start px-10 py-16 items-center gap-5 mx-auto max-w-2xl md:max-w-lg text-center">
        <h1 className="text-3xl font-bold">About My Blogs</h1>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Welcome to My Tech Blog!</h1>
          <p className="">
            My name is <b>Domendra Kumar Sahu</b>, and I’m a web developer
            passionate about modern technologies like the MERN stack and
            Next.js. I'm here to share my knowledge and experience with you,
            providing insights and tutorials that can help you grow as a
            developer. Whether you're just starting or looking to sharpen your
            skills, I hope you'll find valuable content that resonates with your
            journey.
          </p>
        </div>
        <div className="">
          <p className="">
            I'm passionate about modern web development, with a focus on the
            MERN stack (MongoDB, Express.js, React.js, Node.js) and Next.js.
            These technologies are essential for building dynamic and scalable
            web applications. Through this blog, I share insights, tutorials,
            and tips to help developers at all levels master these tools.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Why Follow My Blog?</h2>
          <p className="">
            Here, you’ll find practical content that simplifies complex concepts
            in MERN stack and Next.js development. Whether you're a beginner or
            an experienced developer, my goal is to provide valuable resources
            that help you stay updated and improve your skills in web
            development.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
