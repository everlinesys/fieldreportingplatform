import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import api from "../api/api";

export default function UploadPage() {
  const { token } = useParams();

  const [image, setImage] =
    useState(null);

  const [video, setVideo] =
    useState(null);

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [employee, setEmployee] =
    useState("");

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await api.get(
        `/upload/${token}/details`
      );

      setEmployee(
        res.data.employee
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("note", note);

      if (image) {
        formData.append("image", image);
      }

      if (video) {
        formData.append("video", video);
      }

      await api.post(
        `/upload/${token}`,
        formData
      );

      setSuccess(true);

      setImage(null);
      setVideo(null);
      setNote("");
    } catch (error) {
      console.error(error);

      alert(
        "Submission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />

        <div className="absolute bottom-[-200px] right-[-120px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="border-b border-white/10 px-8 py-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-blue-300 font-medium">
                  Employee Submission Portal
                </p>

                <h1 className="text-4xl font-bold mt-4 tracking-tight">
                  Field Report Submission
                </h1>

                <p className="text-gray-400 mt-4 max-w-lg leading-relaxed">
                  Upload operational media
                  records and field notes for
                  centralized administrative
                  review.
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Employee */}
          <div className="px-8 py-5 border-b border-white/10 bg-black/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Assigned Employee
                </p>

                <h2 className="text-2xl font-semibold mt-2">
                  {employee ||
                    "Loading..."}
                </h2>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-2 rounded-2xl text-sm font-medium">
                Secure Session Active
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Success */}
            {success && (
              <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-300 px-5 py-4 rounded-2xl">
                Submission uploaded
                successfully.
              </div>
            )}

            <div className="space-y-6">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Image Attachment
                </label>

                <label className="group border border-dashed border-white/15 hover:border-blue-400/40 transition rounded-3xl bg-white/[0.03] p-8 cursor-pointer flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-xl">
                    IMG
                  </div>

                  <h3 className="font-medium">
                    {image
                      ? image.name
                      : "Select image file"}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    JPG, PNG or WEBP
                  </p>

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      setImage(
                        e.target.files[0]
                      )
                    }
                  />
                </label>
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Video Attachment
                </label>

                <label className="group border border-dashed border-white/15 hover:border-blue-400/40 transition rounded-3xl bg-white/[0.03] p-8 cursor-pointer flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-xl">
                    VID
                  </div>

                  <h3 className="font-medium">
                    {video
                      ? video.name
                      : "Select video file"}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    MP4, MOV or AVI
                  </p>

                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={(e) =>
                      setVideo(
                        e.target.files[0]
                      )
                    }
                  />
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Operational Notes
                </label>

                <textarea
                  rows={5}
                  placeholder="Enter report details..."
                  value={note}
                  onChange={(e) =>
                    setNote(
                      e.target.value
                    )
                  }
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-400/40 rounded-3xl p-5 outline-none resize-none text-white placeholder:text-gray-500 transition"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-white text-black hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 py-4 rounded-2xl font-semibold text-lg disabled:opacity-50"
              >
                {loading
                  ? "Submitting Report..."
                  : "Submit Field Report"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-8 py-5 flex items-center justify-between text-sm text-gray-500">
            <span>
              Internal Reporting System
            </span>

            <span>
              Protected Enterprise Channel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}