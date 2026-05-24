import { useEffect, useState } from "react";
import {
    LogOut,
    Plus,
    Copy,
    MessageSquare,
    ChevronUp,
    ChevronDown,
    X,
    FileText,
    Link2,
    CheckCircle,
    Clock
} from "lucide-react";
import api from "../api/api";

export default function Admin() {
    const [employee, setEmployee] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [links, setLinks] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [activeTab, setActiveTab] = useState("links");

    const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
    const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");

    const createLink = async () => {
        if (!employee.trim()) return;
        try {
            await api.post("/admin/create-link", { employee });
            setEmployee("");
            fetchLinks();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLinks = async () => {
        try {
            const res = await api.get("/admin/links");
            setLinks(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const res = await api.get("/admin/submissions");
            setSubmissions(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const copyLink = (token) => {
        const url = `${frontendUrl}/upload/${token}`;
        navigator.clipboard.writeText(url);
        // Optional: Replace alert with a temporary toast state if you have one
        alert("Link copied");
    };

    useEffect(() => {
        fetchLinks();
        fetchSubmissions();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased selection:bg-blue-500/30">
            {/* Dynamic Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                        <img src="/logo.png" alt="Brand Logo" className="h-12 my-3 rounded-lg " />
                        <div className="hidden md:block">

                            <h1 className=" text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                Compliance Dashboard
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium">
                                Enterprise submission management system
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:scale-95 transition-all px-4 py-2 rounded-xl text-sm font-medium text-slate-300"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
                    {/* Top Panel Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Action Card */}
                        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-slate-200 mb-1">
                                    Create Upload Link
                                </h2>
                                <p className="text-xs text-slate-400 mb-4">Generate secure tokenized endpoints.</p>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={employee}
                                    onChange={(e) => setEmployee(e.target.value)}
                                    placeholder="Employee name"
                                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2.5 outline-none text-sm transition-all text-slate-200 placeholder:text-slate-500"
                                />

                                <button
                                    onClick={createLink}
                                    className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10"
                                >
                                    <Plus className="w-4 h-4" />
                                    Generate Link
                                </button>
                            </div>
                        </div>

                        {/* Metrics Dashboard */}
                        <MetricCard label="Total Links" count={links.length} icon={Link2} color="text-blue-400 bg-blue-500/5" />
                        <MetricCard label="Total Submissions" count={submissions.length} icon={FileText} color="text-violet-400 bg-violet-500/5" />
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex border-b border-slate-800 p-0.5 max-w-xs bg-slate-950/40 rounded-xl border">
                        <button
                            onClick={() => setActiveTab("links")}
                            className={`flex-1 text-center py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "links"
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            Upload Links
                        </button>
                        <button
                            onClick={() => setActiveTab("submissions")}
                            className={`flex-1 text-center py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "submissions"
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            Submissions
                        </button>
                    </div>

                    {/* Tab Views */}
                    {activeTab === "links" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {links.map((link) => (
                                <LinkCard
                                    key={link.id}
                                    link={link}
                                    frontendUrl={frontendUrl}
                                    copyLink={copyLink}
                                />
                            ))}
                        </div>
                    )}

                    {activeTab === "submissions" && (
                        <div className="space-y-4">
                            {submissions.map((item) => (
                                <SubmissionCard
                                    key={item.id}
                                    item={item}
                                    backendUrl={backendUrl}
                                    expanded={expandedId === item.id}
                                    onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                    setPreviewImage={setPreviewImage}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modern Portal Overlay Image Preview */}
            {previewImage && (
                <div
                    onClick={() => setPreviewImage(null)}
                    className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                >
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <img
                        src={previewImage}
                        alt="Dashboard Context Visual Preview"
                        className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl ring-1 ring-slate-800"
                    />
                </div>
            )}
        </div>
    );
}

/* Reusable UI Sub-components */

function MetricCard({ label, count, icon: Icon, color }) {
    return (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm flex items-center justify-between group hover:border-slate-700/80 transition-all">
            <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">{label}</p>
                <h3 className="text-4xl font-bold tracking-tight text-slate-100">{count}</h3>
            </div>
            <div className={`p-4 rounded-xl border border-slate-800/50 ${color} transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}

function LinkCard({ link, frontendUrl, copyLink }) {
    const uploadUrl = `${frontendUrl}/upload/${link.token}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `Please complete your compliance submission:\n${uploadUrl}`
    )}`;
    const isUsed = link.used || link.submissions?.length > 0;

    return (
        <div className="bg-slate-900/30 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all backdrop-blur-xs">
            <div>
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-slate-100 truncate max-w-[180px]">
                        {link.employee}
                    </h3>
                    {isUsed ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium">
                            <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">
                            <Clock className="w-3 h-3" /> Active
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                    {link.submissions?.length || 0} submission(s)
                </p>

                <div className="mt-4 bg-slate-950/80 border border-slate-800/60 rounded-xl p-3 break-all text-xs text-slate-400 font-mono select-all">
                    {uploadUrl}
                </div>
            </div>

            {!isUsed && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => copyLink(link.token)}
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all py-2.5 rounded-xl text-xs font-semibold text-slate-200"
                    >
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                    </button>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 transition-all py-2.5 rounded-xl text-xs font-semibold text-white text-center shadow-lg shadow-emerald-600/5"
                    >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                </div>
            )}
        </div>
    );
}

function SubmissionCard({ item, backendUrl, expanded, onToggle, setPreviewImage }) {
    return (
        <div className="bg-slate-900/20 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl overflow-hidden transition-colors backdrop-blur-xs">
            <button
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-slate-900/20 focus:outline-hidden"
            >
                <div>
                    <h2 className="text-lg font-bold text-slate-100">{item.name}</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        {item.phone} <span className="text-slate-600 mx-1.5">•</span> {item.email}
                    </p>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-lg text-slate-400 border border-slate-800/40">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-slate-800/60 bg-slate-950/20 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailCard label="Assigned Employee" value={item.link?.employee} />
                        <DetailCard label="Submitted At" value={new Date(item.createdAt).toLocaleString()} />
                        <DetailCard label="Phone Record" value={item.phone} />
                        <DetailCard label="Email Address" value={item.email} />
                        <div className="md:col-span-2">
                            <DetailCard label="Physical Address" value={item.address} />
                        </div>
                        <div className="md:col-span-2">
                            <DetailCard label="Standards Required" value={item.standardsRequired} />
                        </div>
                    </div>

                    {/* Media Galleries */}
                    {item.images?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Captured Media Asset Blocks</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {item.images.map((image) => (
                                    <img
                                        key={image.id}
                                        src={`${backendUrl}/${image.imageUrl}`}
                                        alt="Uploaded Evidence"
                                        onClick={() => setPreviewImage(`${backendUrl}/${image.imageUrl}`)}
                                        className="h-32 w-full object-cover rounded-xl border border-slate-800/80 cursor-pointer hover:scale-[1.03] hover:border-slate-600 transition-all"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {item.videos?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                Video Records
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {item.videos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden"
                                    >
                                        {/* Bunny Player */}
                                        <div className="relative aspect-video bg-black">
                                            <iframe
                                                src={`https://iframe.mediadelivery.net/embed/${import.meta.env.VITE_BUNNY_LIBRARY_ID}/${video.videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
                                                loading="lazy"
                                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                                allowFullScreen
                                                className="absolute top-0 left-0 w-full h-full border-0"
                                            />
                                        </div>

                                        {/* Footer */}
                                        <div className="px-4 py-3 border-t border-slate-800/80 flex items-center justify-between">
                                            <div>



                                            </div>

                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {item.legalDocs?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Legal Documentation</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {item.legalDocs.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={`${backendUrl}/${doc.fileUrl}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-900/40"
                                    >
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <span className="truncate">View Document Manifest</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function DetailCard({ label, value }) {
    return (
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3.5">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-medium text-slate-200 break-words">{value || "—"}</p>
        </div>
    );
}