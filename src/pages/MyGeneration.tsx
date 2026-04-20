import { useEffect, useState } from "react";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SoftBackdrop from "../components/SoftBackdrop";
import type { IThumbnail } from "../assets/assets";
import { ApiError, apiRequest } from "../lib/api";

type ThumbnailsResponse = {
  thumbnails: IThumbnail[];
};

const MyGeneration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const fetchThumbnails = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiRequest<ThumbnailsResponse>(
          "/api/user/thumbnails",
        );

        if (!isCancelled) {
          setThumbnails(response.thumbnails);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          navigate("/login", {
            replace: true,
            state: { from: location.pathname },
          });
          return;
        }

        setError(
          error instanceof Error ? error.message : "Unable to load thumbnails.",
        );
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void fetchThumbnails();

    return () => {
      isCancelled = true;
    };
  }, [location.pathname, navigate]);

  const handleDownload = (imageUrl: string) => {
    window.open(imageUrl, "_blank");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError("");

    try {
      await apiRequest(`/api/thumbnail/delete/${id}`, {
        method: "DELETE",
      });

      setThumbnails((currentThumbnails) =>
        currentThumbnails.filter((thumbnail) => thumbnail._id !== id),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete thumbnail.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <SoftBackdrop />

      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">
            My Generations
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            View and manage all your AI-generated thumbnails
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] animate-pulse rounded-2xl border border-white/10 bg-white/6"
              />
            ))}
          </div>
        )}

        {!loading && thumbnails.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="text-lg font-semibold text-zinc-200">
              No thumbnails yet
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Generate your first thumbnail to see it here
            </p>
          </div>
        )}

        {!loading && thumbnails.length > 0 && (
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 2xl:columns-4">
            {thumbnails.map((thumb) => {
              const aspectClass =
                aspectRatioClassMap[thumb.aspect_ratio || "16:9"];
              const previewSearch = new URLSearchParams({
                thumbnail_url: thumb.image_url ?? "",
                title: thumb.title,
              }).toString();

              return (
                <div
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="group relative mb-8 cursor-pointer break-inside-avoid rounded-2xl border border-white/10 bg-white/6 shadow-xl transition"
                >
                  <div
                    className={`relative overflow-hidden rounded-t-2xl bg-black ${aspectClass}`}
                  >
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center text-zinc-400">
                        {thumb.isGenerating ? "Generating..." : "No image"}
                      </div>
                    )}

                    {thumb.isGenerating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
                        Generating...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100">
                      {thumb.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                      <span className="rounded bg-white/8 px-2 py-0.5">
                        {thumb.style}
                      </span>
                      <span className="rounded bg-white/8 px-2 py-0.5">
                        {thumb.color_scheme ?? "default"}
                      </span>
                      <span className="rounded bg-white/8 px-2 py-0.5">
                        {thumb.aspect_ratio}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {thumb.createdAt
                        ? new Date(thumb.createdAt).toDateString()
                        : "Recently generated"}
                    </p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 gap-1.5 max-sm:flex sm:hidden group-hover:flex"
                  >
                    <TrashIcon
                      onClick={() => handleDelete(thumb._id)}
                      className={`size-6 rounded bg-black/50 p-1 transition-all ${
                        deletingId === thumb._id
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-pink-600"
                      }`}
                    />
                    <DownloadIcon
                      onClick={() => thumb.image_url && handleDownload(thumb.image_url)}
                      className="size-6 rounded bg-black/50 p-1 transition-all hover:bg-pink-600"
                    />
                    {thumb.image_url && (
                      <Link
                        target="_blank"
                        rel="noreferrer"
                        to={`/preview?${previewSearch}`}
                        aria-label={`Open preview for ${thumb.title}`}
                      >
                        <ArrowUpRightIcon className="size-6 rounded bg-black/50 p-1 transition-all hover:bg-pink-600" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyGeneration;
