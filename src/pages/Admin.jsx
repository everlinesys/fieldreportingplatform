import { useEffect, useState } from "react";
import api from "../api/api";

export default function Admin() {
    const [employee, setEmployee] =
        useState("");
    const [previewImage, setPreviewImage] =
        useState(null);
    const [links, setLinks] = useState([]);
    const [expandedId, setExpandedId] =
        useState(null);
    const [submissions, setSubmissions] =
        useState([]);

    const [activeTab, setActiveTab] =
        useState("links");

    const frontendUrl =
        "https://field-reporting-smoky.vercel.app";

    const backendUrl =
        "https://fieldreportingapi.everlinesystems.in";

    const createLink = async () => {
        if (!employee.trim()) return;

        try {
            await api.post(
                "/admin/create-link",
                {
                    employee,
                }
            );

            setEmployee("");

            fetchLinks();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLinks = async () => {
        try {
            const res = await api.get(
                "/admin/links"
            );

            setLinks(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const res = await api.get(
                "/admin/submissions"
            );

            setSubmissions(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const copyLink = (token) => {
        const url =
            `${frontendUrl}/upload/${token}`;

        navigator.clipboard.writeText(url);

        alert("Link copied");
    };

    useEffect(() => {
        fetchLinks();
        fetchSubmissions();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B1120] text-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-blue-500/20 rounded-full blur-3xl" />

                <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-violet-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Field Reporting
                            </h1>

                            <p className="text-gray-400 mt-1">
                                Employee upload management
                                system
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                localStorage.removeItem(
                                    "token"
                                );

                                window.location.href =
                                    "/login";
                            }}
                            className="bg-white/10 hover:bg-white/20 transition px-5 py-2 rounded-2xl"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto p-6">
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        {/* Create */}
                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5">
                            <h2 className="text-xl font-bold mb-4">
                                Create Upload Link
                            </h2>

                            <div className="space-y-3">
                                <input
                                    value={employee}
                                    onChange={(e) =>
                                        setEmployee(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Employee name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-400"
                                />

                                <button
                                    onClick={createLink}
                                    className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-2xl font-semibold"
                                >
                                    Generate Link
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <p className="text-gray-400">
                                Total Links
                            </p>

                            <h2 className="text-5xl font-bold mt-4">
                                {links.length}
                            </h2>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <p className="text-gray-400">
                                Total Submissions
                            </p>

                            <h2 className="text-5xl font-bold mt-4">
                                {
                                    submissions.length
                                }
                            </h2>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3 mb-8">
                        <button
                            onClick={() =>
                                setActiveTab("links")
                            }
                            className={`px-6 py-3 rounded-2xl font-semibold transition ${activeTab === "links"
                                ? "bg-white text-black"
                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                                }`}
                        >
                            Upload Links
                        </button>

                        <button
                            onClick={() =>
                                setActiveTab(
                                    "submissions"
                                )
                            }
                            className={`px-6 py-3 rounded-2xl font-semibold transition ${activeTab ===
                                "submissions"
                                ? "bg-white text-black"
                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                                }`}
                        >
                            Submissions
                        </button>
                    </div>

                    {/* Links Tab */}
                    {activeTab === "links" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {links.map((link) => (
                                <div
                                    key={link.id}
                                    className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:border-blue-400/40 transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                {
                                                    link.employee
                                                }
                                            </h3>

                                            <p className="text-gray-400 text-sm mt-1">
                                                {
                                                    link
                                                        .submissions
                                                        .length
                                                }{" "}
                                                submission(s)
                                            </p>
                                        </div>

                                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                                    </div>

                                    <div className="mt-5 bg-black/30 border border-white/10 rounded-2xl p-4 break-all text-sm text-gray-300">
                                        {frontendUrl}
                                        /upload/
                                        {link.token}
                                    </div>

                                    <button
                                        onClick={() =>
                                            copyLink(
                                                link.token
                                            )
                                        }
                                        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-2xl font-semibold"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submissions Tab */}
                    {/* Submissions Tab */}
                    {activeTab === "submissions" && (
                        <div className="space-y-3">
                            {submissions.map((item) => {
                                const expanded =
                                    expandedId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all"
                                    >
                                        {/* Compact Row */}
                                        <button
                                            onClick={() =>
                                                setExpandedId(
                                                    expanded
                                                        ? null
                                                        : item.id
                                                )
                                            }
                                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.03] transition text-left"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                {/* Avatar */}
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold shrink-0">
                                                    {item.link.employee
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                {/* Info */}
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-lg truncate">
                                                        {
                                                            item.link
                                                                .employee
                                                        }
                                                    </h3>

                                                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                                        <span>
                                                            {new Date(
                                                                item.createdAt
                                                            ).toLocaleDateString()}
                                                        </span>

                                                        {item.imagePath && (
                                                            <span>
                                                                🖼️ Image
                                                            </span>
                                                        )}

                                                        {item.videoPath && (
                                                            <span>
                                                                🎥 Video
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right */}
                                            <div className="flex items-center gap-4 shrink-0 ml-4">
                                                <div className="bg-green-500/15 text-green-300 text-xs px-3 py-1 rounded-full font-medium">
                                                    Submitted
                                                </div>

                                                <div
                                                    className={`transition-transform duration-300 ${expanded
                                                        ? "rotate-180"
                                                        : ""
                                                        }`}
                                                >
                                                    ▼
                                                </div>
                                            </div>
                                        </button>

                                        {/* Expandable Content */}
                                        {expanded && (
                                            <div className="px-5 pb-5 border-t border-white/10 animate-in fade-in duration-300">
                                                {/* Note */}
                                                {item.note && (
                                                    <div className="mt-5 bg-black/20 border border-white/10 rounded-2xl p-4 text-gray-300 leading-relaxed">
                                                        {item.note}
                                                    </div>
                                                )}

                                                {/* Media */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                                    {item.imagePath && (
                                                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 group">
                                                            <img
                                                                src={`${backendUrl}/${item.imagePath}`}
                                                                alt=""
                                                                onClick={() =>
                                                                    setPreviewImage(
                                                                        `${backendUrl}/${item.imagePath}`
                                                                    )
                                                                }
                                                                className="w-full h-[300px] object-cover hover:scale-105 transition duration-500 cursor-pointer"
                                                            />

                                                            {/* Overlay */}
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center pointer-events-none">
                                                                <div className="opacity-0 group-hover:opacity-100 transition bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl text-white text-sm font-medium">
                                                                    View Fullscreen
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.videoPath && (
                                                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                                                            <video
                                                                controls
                                                                className="w-full h-[300px] object-cover"
                                                            >
                                                                <source
                                                                    src={`${backendUrl}/${item.videoPath}`}
                                                                />
                                                            </video>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Bottom Info */}
                                                <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-400">
                                                    <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                                                        Submission ID:{" "}
                                                        {item.id}
                                                    </div>

                                                    <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                                                        {new Date(
                                                            item.createdAt
                                                        ).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
            {/* Fullscreen Image Preview */}
            {previewImage && (
                <div
                    onClick={() =>
                        setPreviewImage(null)
                    }
                    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-5"
                >
                    {/* Close Button */}
                    <button
                        onClick={() =>
                            setPreviewImage(null)
                        }
                        className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 transition text-white text-xl"
                    >
                        ✕
                    </button>

                    {/* Image */}
                    <img
                        src={previewImage}
                        alt=""
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        className="max-w-full max-h-full rounded-3xl shadow-2xl object-contain"
                    />
                </div>
            )}
        </div>
    );
}