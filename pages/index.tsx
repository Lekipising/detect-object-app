/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Head from "next/head";
import React, { useState } from "react";

export default function Home() {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [objName, setObjName] = useState("");

  const [noClassFound, setNoClassFound] = useState(false);

  const [base64, setBase64] = useState(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const obj = {
      json: objName.toLowerCase(),
    };
    const json = JSON.stringify(obj);
    const blob = new Blob([json], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("json", blob);

    // axios config
    const res = await axios.post(
      process.env.NODE_ENV === "development"
        ? `http://127.0.0.1:5000/detect`
        : `https://object-detect.onrender.com/detect`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Control-Allow-Origin": "*",
        },
      }
    );
    setLoading(false);
    if (res.data.base64 === "No match found") {
      setNoClassFound(true);
      return;
    }
    setBase64(res.data.base64);
  };

  const countBoolsTrue = (arr) => {
    let count = 0;
    arr.forEach((item) => {
      if (item) {
        count++;
      }
    });
    return count;
  };

  return (
    <>
      <Head>
        <title>Detect Objects in Videos</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1 user-scalable=no"
        />
      </Head>
      <main className="min-h-screen w-screen flex justify-center items-center text-white gap-32">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 bg-purple-600/20 p-8 rounded-lg">
            <h1 className="text-2xl font-bold">Welcome to the game! </h1>
            <h2 className="">Instructions are simple:</h2>
            <ul className="ml-8 list-decimal">
              <li>Upload a video</li>
              <li>Type an object in the video</li>
              <li>Process the video</li>
              <li>Get results</li>
              <li>Good luck!</li>
            </ul>
          </div>
          <form className="flex flex-col gap-8 bg-purple-600/20 p-8 rounded-lg">
            {/* step one */}

            <>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
              <input
                type="text"
                value={objName}
                onChange={(e) => setObjName(e.target.value)}
                placeholder="Enter type of object..."
                className="font-semibold px-8 text-sm py-2 rounded-lg text-[#686868]"
                id="object"
                name="object"
              />
              <button
                type="submit"
                disabled={loading || !videoFile || !objName}
                className="bg-blue-700 text-lg font-semibold px-8 py-1 rounded-lg"
                onClick={(e) => handleSubmit(e)}
              >
                {loading ? "Loading..." : "Process Video"}
              </button>
            </>
          </form>
        </div>

        <div
          className={`flex transition-all ease-in duration-300 flex-col gap-8 ${
            countBoolsTrue([videoFile, base64]) * 96
          }px}`}
        >
          {videoFile && (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-lg">Uploaded Video</h2>
              <video
                src={URL.createObjectURL(videoFile)}
                controls
                className="w-96 h-auto"
              />
            </div>
          )}
          {base64 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-lg text-green-500">
                Detected object
              </h2>
              <img
                src={`data:image/png;base64,${base64}`}
                alt="video"
                className="w-96 h-auto"
              />
            </div>
          )}
          {noClassFound && (
            <h2 className="font-bold text-lg text-red">
              We did not find that object in the video, try again!
            </h2>
          )}
        </div>
      </main>
    </>
  );
}
