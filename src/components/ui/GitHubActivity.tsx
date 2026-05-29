"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaCodeBranch, FaStar, FaCode, FaCodeFork, FaArrowsRotate } from "react-icons/fa6";

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: { message: string }[];
    ref_type?: string;
    ref?: string;
  };
}

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getEventDetails(event: GitHubEvent) {
  switch (event.type) {
    case "PushEvent":
      return {
        icon: <FaCode />,
        color: "text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20",
        action: `Pushed ${event.payload.commits?.length || 1} commit${(event.payload.commits?.length || 1) !== 1 ? "s" : ""}`,
        detail: event.payload.commits?.[0]?.message || "",
      };
    case "CreateEvent":
      return {
        icon: <FaCodeBranch />,
        color: "text-green-400",
        bg: "bg-green-500/10 border-green-500/20",
        action: `Created ${event.payload.ref_type} ${event.payload.ref || ""}`,
        detail: "",
      };
    case "WatchEvent":
      return {
        icon: <FaStar />,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10 border-yellow-500/20",
        action: "Starred a repository",
        detail: "",
      };
    case "ForkEvent":
      return {
        icon: <FaCodeFork />,
        color: "text-purple-400",
        bg: "bg-purple-500/10 border-purple-500/20",
        action: "Forked a repository",
        detail: "",
      };
    default:
      return {
        icon: <FaGithub />,
        color: "text-gray-400",
        bg: "bg-gray-500/10 border-gray-500/20",
        action: event.type.replace("Event", " Event"),
        detail: "",
      };
  }
}

export default function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchActivity = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        "https://api.github.com/users/Fiercexontan/events/public?per_page=8"
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setEvents(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <section className="relative bg-black py-24 px-6 overflow-hidden">

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-75 bg-purple-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaGithub className="text-white text-xl" />
              <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
                Live GitHub Activity
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Built in public.{" "}
              <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Every commit.
              </span>
            </h2>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchActivity}
            className="flex items-center gap-2 text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full text-sm transition-all duration-200"
          >
            <FaArrowsRotate className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 text-gray-500">
            <FaGithub className="text-4xl mx-auto mb-3 opacity-30" />
            <p>Could not load GitHub activity. Try refreshing.</p>
          </div>
        )}

        {/* Events List */}
        {!loading && !error && (
          <div className="space-y-3">
            {events.map((event) => {
              const details = getEventDetails(event);
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/10 hover:border-white/20 hover:bg-white/6 transition-all duration-200 group"
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg border ${details.bg} flex items-center justify-center flex-shrink-0 ${details.color} text-sm`}>
                    {details.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-sm font-medium truncate">
                        {details.action}
                      </p>
                      <span className="text-gray-600 text-xs flex-shrink-0">
                        {timeAgo(event.created_at)}
                      </span>
                    </div>
                    <p className="text-blue-400/70 text-xs mt-0.5 truncate group-hover:text-blue-400 transition-colors">
                      {event.repo.name}
                    </p>
                    {details.detail && (
                      <p className="text-gray-600 text-xs mt-0.5 truncate">
                        {details.detail}
                      </p>
                    )}
                  </div>

                  {/* Live dot */}
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Footer link */}
        {!loading && !error && (
          <div className="mt-6 text-center">
            <a
              href="https://github.com/Fiercexontan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <FaGithub />
              View full profile on GitHub
            </a>
          </div>
        )}
      </div>
    </section>
  );
}