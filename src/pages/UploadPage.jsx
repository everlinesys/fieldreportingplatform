import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  UploadCloud, CheckCircle2, User, FileText, Image, Video, X,
  FileCheck, Mail, Phone, MapPin, ClipboardList, AlertCircle, ShieldAlert
} from "lucide-react";
import api from "../api/api";

export default function UploadPage() {
  const { token } = useParams();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [used, setUsed] = useState(false);
  const [employee, setEmployee] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    standardsRequired: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [legalDocs, setLegalDocs] = useState([]);
  const [videoUploading, setVideoUploading] =
    useState(false);

  const [videoProgress, setVideoProgress] =
    useState(0);
  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/upload/${token}/details`);
      setEmployee(res.data.employee);
      if (res.data.used) {
        setUsed(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  async function uploadVideoToBunny(
    file
  ) {
    try {
      setVideoUploading(true);

      const { data } =
        await api.post(
          "/upload/create-video",
          {
            title: file.name,
          }
        );

      const {
        videoId,
        uploadUrl,
        accessKey,
      } = data;

      return new Promise(
        (resolve, reject) => {
          const xhr =
            new XMLHttpRequest();

          xhr.open(
            "PUT",
            uploadUrl
          );

          xhr.setRequestHeader(
            "AccessKey",
            accessKey
          );

          xhr.setRequestHeader(
            "Content-Type",
            file.type ||
            "application/octet-stream"
          );

          xhr.upload.onprogress = (
            e
          ) => {
            if (
              e.lengthComputable
            ) {
              setVideoProgress(
                Math.floor(
                  (e.loaded /
                    e.total) *
                  100
                )
              );
            }
          };

          xhr.onload = () => {
            setVideoUploading(
              false
            );

            if (
              xhr.status >= 200 &&
              xhr.status < 300
            ) {
              resolve({
                videoId,
              });
            } else {
              reject(
                "Upload failed"
              );
            }
          };

          xhr.onerror = () => {
            setVideoUploading(
              false
            );

            reject(
              "Upload failed"
            );
          };

          xhr.send(file);
        }
      );
    } catch (error) {
      console.error(error);

      setVideoUploading(false);

      throw error;
    }
  }
  /* Add Files */
  const addImages = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const addVideos = async (e) => {
    const files = Array.from(
      e.target.files
    );

    for (const file of files) {
      try {
        const uploaded =
          await uploadVideoToBunny(
            file
          );

        setVideos((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            videoId:
              uploaded.videoId,
          },
        ]);
      } catch (error) {
        console.error(error);

        alert(
          `Failed to upload ${file.name}`
        );
      }
    }
  };

  const addLegalDocs = (e) => {
    setLegalDocs((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  /* Remove Files */
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeLegalDoc = (index) => {
    setLegalDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((file) => formData.append("images", file));
      formData.append(
        "videos",
        JSON.stringify(videos)
      );
      legalDocs.forEach((file) => formData.append("legalDocs", file));

      await api.post(`/upload/${token}`, formData);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* LINK USED OVERLAY VIEW */
  if (used) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-5 text-slate-100 antialiased font-sans">
        <div className="max-w-md w-full bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-10 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <img src="/logo.jpeg" alt="Audizy Logo" className="h-6 mx-auto mb-4 opacity-40 mix-blend-luminosity" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Portal Link Expired</h1>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed font-medium">
            This secure Audizy compliance reporting token has already been compiled and submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  /* SUBMISSION SUCCESS OVERLAY VIEW */
  if (success) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center px-5 relative overflow-hidden antialiased font-sans">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-xl w-full bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-10 text-center backdrop-blur-xl shadow-2xl shadow-black/50">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 text-emerald-400 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <img src="/logo.jpeg" alt="Audizy Logo" className="h-7 mx-auto mb-5" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Transmission Verified</h1>
          <p className="text-slate-400 mt-4 text-sm sm:text-base leading-relaxed font-medium">
            Your field record has been cryptographically sealed and pushed down the pipeline for immediate review.
          </p>

          <div className="mt-8 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center">
            <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Assigned Field Auditor
            </p>
            <h2 className="text-xl font-bold text-slate-200 mt-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> {employee}
            </h2>
          </div>

          <p className="text-slate-600 text-xs font-medium mt-8 tracking-wide">
            AUDIZY SECURE ENVIRONMENT • PIPELINE INSTANCE TERMINATED
          </p>
        </div>
      </div>
    );
  }

  /* BASE SYSTEM FORM INSTANCE */
  if (!employee)
    return (<><div className="min-h-screen bg-[#030712] flex items-center justify-center px-5 text-slate-100 antialiased font-sans">
      <div className="max-w-md w-full bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-10 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 text-blue-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <img src="/logo.jpeg" alt="Audizy Logo" className="h-6 mx-auto mb-4 opacity-40 mix-blend-luminosity" />
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Resolving Submission Context</h1>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed font-medium">
          Fetching secure metadata and validating submission token. Please wait...
        </p>
      </div>
    </div>
    </>)

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden antialiased font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 md:px-8">
        <div className="w-full max-w-5xl bg-slate-900/30 border border-slate-800/80 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 grid grid-cols-1">

          {/* Main Structural Branding Header */}
          <div className="border-b border-slate-800/60 p-8 md:p-10 flex flex-col md:flex-row md:items-start justify-between gap-6 bg-slate-950/20">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src="/logo.jpeg" alt="Audizy Logo" className="h-6 w-auto object-contain" />
                <div className="h-4 w-[1px] bg-slate-800" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                  Compliance Module
                </p>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Field Data Submission
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed font-medium">
                Pipeline architecture for uploading legal records, situational media buffers, and verification infrastructure assets.
              </p>
            </div>

            {/* Dynamic Metadata Block */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 min-w-[220px] shadow-inner">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Assigned Authority
              </p>
              <div className="flex items-center gap-2.5 mt-2 text-slate-200">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="font-bold text-sm tracking-tight">
                  {employee || "Resolving Metadata..."}
                </span>
              </div>
            </div>
          </div>

          {/* Core Pipeline Form Area */}
          <div className="p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Auditor Full Name"
                name="name"
                value={form.name}
                icon={User}
                placeholder="Jane Doe"
                onChange={handleChange}
              />
              <Input
                label="Secure Phone Vector"
                name="phone"
                value={form.phone}
                icon={Phone}
                placeholder="+1 (555) 000-0000"
                onChange={handleChange}
              />
              <Input
                label="Administrative Email"
                name="email"
                value={form.email}
                icon={Mail}
                placeholder="j.doe@audizy-network.com"
                onChange={handleChange}
              />

              {/* Contextual Textarea Blocks */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> Deployment Address / Vector Locality
                </label>
                <textarea
                  rows={2}
                  name="address"
                  value={form.address}
                  placeholder="Enter localized grid coordinates or structural complex mapping..."
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none rounded-xl p-4 text-sm text-white placeholder:text-slate-700 transition-all resize-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5 text-slate-500" /> Core Protocols / Standards Imposed
                </label>
                <textarea
                  rows={3}
                  name="standardsRequired"
                  value={form.standardsRequired}
                  placeholder="Specify applicable compliance benchmarks, legal mandates, or standard operating framework parameters..."
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none rounded-xl p-4 text-sm text-white placeholder:text-slate-700 transition-all resize-none"
                />
              </div>
            </div>

            {/* Asynchronous File Droppers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Asset Buffer Arrays</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UploadBox
                  title="Images Array"
                  subtitle={`${images.length} item(s) staged`}
                  accept="image/*"
                  icon={Image}
                  color="text-blue-400 bg-blue-500/10 border-blue-500/20"
                  onChange={addImages}
                />
                <UploadBox
                  title="Video Buffers"
                  subtitle={`${videos.length} item(s) staged`}
                  accept="video/*"
                  icon={Video}
                  color="text-purple-400 bg-purple-500/10 border-purple-500/20"
                  onChange={addVideos}
                />{videoUploading && (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-300">
                        Uploading to Bunny Stream
                      </p>

                      <p className="text-sm text-blue-400 font-semibold">
                        {videoProgress}%
                      </p>
                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${videoProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <UploadBox
                  title="Legal Vectors"
                  subtitle={`${legalDocs.length} item(s) staged`}
                  accept=".pdf,image/*"
                  icon={FileText}
                  color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  onChange={addLegalDocs}
                />
              </div>
            </div>

            {/* Interactive File Repositories */}
            <div className="space-y-4 pt-2">
              {images.length > 0 && (
                <FileList title="Staged Imagery Assets" icon={Image} files={images} onRemove={removeImage} />
              )}
              {videos.length > 0 && (
                <FileList title="Staged Videography Buffers" icon={Video} files={videos} onRemove={removeVideo} />
              )}
              {legalDocs.length > 0 && (
                <FileList title="Staged Legal Manifests" icon={FileText} files={legalDocs} onRemove={removeLegalDoc} />
              )}
            </div>

            {/* Verification Execution Pipeline CTA */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-slate-100 hover:bg-white active:scale-[0.99] text-slate-950 transition-all duration-200 py-4 rounded-xl font-bold text-base disabled:opacity-50 shadow-lg shadow-white/5 inline-flex items-center justify-center gap-3"
            >
              {loading ? (
                "Sealing Transmission Package..."
              ) : (
                <>
                  <FileCheck className="w-5 h-5" /> Push Compliance Report to Audizy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* INPUT HELPER COMPONENT */
function Input({ label, name, value, onChange, icon: Icon, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />}
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none rounded-xl pl-11 pr-5 py-3 text-sm text-white placeholder:text-slate-700 transition-all"
        />
      </div>
    </div>
  );
}

/* FILE CONTAINER DROPBOX HELPER */
function UploadBox({ title, subtitle, accept, onChange, icon: Icon, color }) {
  return (
    <label className="border border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-950/40 transition-all duration-200 rounded-2xl p-5 cursor-pointer flex flex-col items-center justify-center text-center group">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition shadow-inner ${color}`}>
        <Icon className="w-5 h-5 group-hover:scale-110 transition" />
      </div>

      <h3 className="text-sm font-semibold text-slate-200 tracking-tight group-hover:text-white transition">
        {title}
      </h3>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
        {subtitle}
      </p>

      <input hidden type="file" accept={accept} multiple onChange={onChange} />
    </label>
  );
}

/* ITERATIVE QUEUE FILE LIST HELPER */
function FileList({ title, files, onRemove, icon: Icon }) {
  return (
    <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 shadow-inner">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-slate-500" /> {title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-slate-950/80 border border-slate-800/60 rounded-xl px-4 py-2.5 min-w-0 group hover:border-slate-700 transition"
          >
            <div className="min-w-0 pr-2">
              <p className="truncate text-xs font-semibold text-slate-300 group-hover:text-slate-200 transition">
                {file.name}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="w-7 h-7 rounded-lg bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/10 text-rose-400 transition flex items-center justify-center flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}