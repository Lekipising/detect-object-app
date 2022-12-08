/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Head from "next/head";
import React, { useState } from "react";

export default function Home() {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [objName, setObjName] = useState("");

  const [noClassFound, setNoClassFound] = useState(false);

  const [classesDetected, setClassesDetected] = useState([]);
  const [showClasses, setShowClasses] = useState(false);

  const [base64, setBase64] = useState(null);

  const handleSubmit = async (e) => {
    setNoClassFound(false);
    setClassesDetected([]);
    setShowClasses(false);
    setBase64(null);
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
      setClassesDetected(res.data.classes);
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

  const [exceedsSize, setExceedsSize] = useState(false);

  const handleVideoFile = (e) => {
    setExceedsSize(false);
    // max file size 1mb
    if (e.target.files[0].size > 1000000) {
      setExceedsSize(true);
      return;
    }
    setExceedsSize(false);
    setVideoFile(e.target.files[0]);
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
              <li>Upload a video - maximum file size of 1mb</li>
              <li>Type an object in the video</li>
              <li>Process the video</li>
              <li>Get results</li>
              <li>Good luck!</li>
            </ul>
          </div>
          <form className="flex relative flex-col gap-8 bg-purple-600/20 p-8 rounded-lg">
            {/* step one */}

            <>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoFile(e)}
              />
              {exceedsSize && (
                <span className="text-xs top-[60px] absolute medium text-red">
                  Maximum file size is 1mb, please upload another video file
                </span>
              )}
              <input
                type="text"
                value={objName}
                readOnly={exceedsSize}
                onChange={(e) => setObjName(e.target.value)}
                placeholder="Enter type of object..."
                className="font-semibold px-8 pl-2 text-sm py-2 rounded-lg text-[#686868]"
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
            <>
              <h2 className="font-bold text-lg text-red">
                We did not find that object in the video, try again!
              </h2>
              {!showClasses && (
                <p className="flex items-center rounded-lg text-white text-md font-medium">
                  <span
                    onClick={() => setShowClasses(!showClasses)}
                    className="font-bold underline"
                  >
                    Click to reveal
                  </span>{" "}
                  <span className="pl-1">
                    {" "}
                    all detected classes here OR try again
                  </span>
                </p>
              )}

              {showClasses && (
                <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-lg text-green-500">
                    Detected objects are {classesDetected.length}
                  </h2>
                  <ul className="grid grid-cols-6 gap-4">
                    {classesDetected.map((item, index) => (
                      <li
                        className="bg-purple-500/5 px-4 font-medium py-2 rounded-md"
                        key={index}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
