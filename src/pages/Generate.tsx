import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  colorSchemes,
  type AspectRatio,
  type IThumbnail,
  type ThumbnailStyle,
} from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectedRatioSelector from "../components/AspectedRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import { ApiError, apiRequest } from "../lib/api";

type SingleThumbnailResponse = {
  thumbnail: IThumbnail;
};

type GenerateThumbnailResponse = {
  image_url: string;
  message: string;
  thumbnail: IThumbnail;
};

const Generate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchemeId, setColorSchemeId] = useState<string>(
    colorSchemes[0].id,
  );
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError("Please add a video title or topic before generating.");
      return;
    }

    setLoading(true);
    setError("");
    setThumbnail(null);

    try {
      const response = await apiRequest<GenerateThumbnailResponse>(
        "/api/thumbnail/generate",
        {
          method: "POST",
          body: {
            title: title.trim(),
            prompt: additionalDetails.trim(),
            style,
            aspect_ratio: aspectRatio,
            color_scheme: colorSchemeId,
          },
        },
      );

      setThumbnail(response.thumbnail);
      navigate(`/generate/${response.thumbnail._id}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to generate thumbnail right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setTitle("");
      setAdditionalDetails("");
      setThumbnail(null);
      setLoading(false);
      setError("");
      setAspectRatio("16:9");
      setColorSchemeId(colorSchemes[0].id);
      setStyle("Bold & Graphic");
      return;
    }

    let isCancelled = false;

    const fetchThumbnail = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiRequest<SingleThumbnailResponse>(
          `/api/user/thumbnail/${id}`,
        );

        if (isCancelled) {
          return;
        }

        setThumbnail(response.thumbnail);
        setAdditionalDetails(response.thumbnail.user_prompt ?? "");
        setTitle(response.thumbnail.title);
        setColorSchemeId(response.thumbnail.color_scheme ?? colorSchemes[0].id);
        setAspectRatio(response.thumbnail.aspect_ratio ?? "16:9");
        setStyle(response.thumbnail.style);
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
          error instanceof Error ? error.message : "Unable to load thumbnail.",
        );
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void fetchThumbnail();

    return () => {
      isCancelled = true;
    };
  }, [id, location.pathname, navigate]);

  return (
    <>
      <SoftBackdrop />
      <div className="min-h-screen pt-24">
        <main className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:pb-8">
          <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
            <div className={`space-y-6 ${id ? "pointer-events-none" : ""}`}>
              <div className="space-y-6 rounded-2xl border border-white/12 bg-white/8 p-6 shadow-xl">
                <div>
                  <h2 className="mb-1 text-xl font-bold text-zinc-100">
                    Create Your Thumbnail
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Describe your vision and let AI bring it to life
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Title or Topic
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="e.g., 10 Tips for Better Sleep"
                      className="w-full rounded-lg border border-white/12 bg-black/20 px-4 py-3 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">
                        {title.length}/100
                      </span>
                    </div>
                  </div>

                  <AspectedRatioSelector
                    value={aspectRatio}
                    onChange={setAspectRatio}
                  />

                  <StyleSelector
                    value={style}
                    onChange={setStyle}
                    isOpen={styleDropdownOpen}
                    setIsOpen={setStyleDropdownOpen}
                  />

                  <ColorSchemeSelector
                    value={colorSchemeId}
                    onChange={setColorSchemeId}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Prompts{" "}
                      <span className="text-xs text-zinc-400">(optional)</span>
                    </label>
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={3}
                      placeholder="Add any specific elements, mood, or style preferences..."
                      className="w-full resize-none rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-rose-300">{error}</p>
                  )}
                </div>

                {!id && (
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !title.trim()}
                    className="w-full rounded-xl bg-linear-to-b from-pink-500 to-pink-600 py-3.5 text-[15px] font-medium transition-colors hover:from-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Generating..." : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-6 shadow-xl">
                <h2 className="mb-4 text-lg font-semibold text-zinc-100">
                  Preview
                </h2>
                <PreviewPanel
                  thumbnail={thumbnail}
                  isLoading={loading}
                  aspectRatio={aspectRatio}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;
