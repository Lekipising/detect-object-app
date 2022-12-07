import axios from "axios";
import Head from "next/head";
import React, { useState } from "react";

export default function Home() {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", videoFile);

    // axios config
    const res = await axios.post(
      `https://object-detect.onrender.com/detect`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Control-Allow-Origin": "*",
        },
      }
    );
    setLoading(false);
    console.log(res);
  };

  const [showInputField, setShowInputField] = useState(true);

  return (
    <>
      <Head>
        <title>Maskani App - Your guide through the real estate jungle</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1 user-scalable=no"
        />
      </Head>
      <main className="min-h-screen w-screen flex justify-center items-center text-white flex-col gap-32">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Welcome to the game! </h1>
          <h2 className="">Instructions are simple:</h2>
          <ul className="ml-8 list-decimal">
            <li>Upload a video</li>
            <li>Wait for our wizard app to process</li>
            <li>Type an object you saw on the video</li>
            <li>Know if got it correct</li>
            <li>Good luck!</li>
          </ul>
        </div>
        <form className="flex flex-col gap-8">
          {showInputField && (
            <>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
              <button
                type="submit"
                disabled={loading || !videoFile}
                className="bg-blue-700 text-lg font-semibold px-8 py-1 rounded-lg"
                onClick={(e) => handleSubmit(e)}
              >
                {loading ? "Loading..." : "Process Video"}
              </button>
            </>
          )}
          {!showInputField && (
            <>
              <input
                type="text"
                placeholder="Enter type of object..."
                className="font-semibold px-8 text-sm py-2 rounded-lg text-[#686868]"
                id="object"
                name="object"
              />
              <button
                type="submit"
                className="bg-white rounded-lg px-8 py-2 text-blue-700 font-bold"
                onClick={(e) => console.log(e)}
              >
                {loading ? "Loading..." : "Check Answer"}
              </button>
            </>
          )}
        </form>
      </main>
    </>
  );
}
