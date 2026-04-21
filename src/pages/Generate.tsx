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
import {
  THUMBNAIL_PROMPT_MAX_LENGTH,
  THUMBNAIL_TITLE_MAX_LENGTH,
  hasValidationErrors,
  validateThumbnailValues,
  type GenerateFieldErrors,
  type GenerateFieldName,
} from "../lib/validation";

type SingleThumbnailResponse = {
  thumbnail: IThumbnail;
};

type GenerateThumbnailResponse = {
  image_url: string;
  message: string;
  thumbnail: IThumbnail;
};

type GenerateErrorPayload = {
  message?: string;
  retryAfterSeconds?: number;
  errors?: Record<string, string>;
};

const getRetryAfterSeconds = (payload: unknown) => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "retryAfterSeconds" in payload &&
    typeof payload.retryAfterSeconds === "number"
  ) {
    return payload.retryAfterSeconds;
  }

  return null;
};

const mapGenerateErrors = (errors?: Record<string, string>) => {
  const mappedErrors: GenerateFieldErrors = {};

  if (!errors) {
    return mappedErrors;
  }

  if (errors.title) {
    mappedErrors.title = errors.title;
  }

  if (errors.prompt) {
    mappedErrors.additionalDetails = errors.prompt;
  }

  if (errors.style) {
    mappedErrors.style = errors.style;
  }

  if (errors.aspect_ratio) {
    mappedErrors.aspectRatio = errors.aspect_ratio;
  }

  if (errors.color_scheme) {
    mappedErrors.colorSchemeId = errors.color_scheme;
  }

  return mappedErrors;
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
  const [fieldErrors, setFieldErrors] = useState<GenerateFieldErrors>({});
  const [quotaRetrySeconds, setQuotaRetrySeconds] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (quotaRetrySeconds === null) {
      return;
    }

    if (quotaRetrySeconds <= 0) {
      setQuotaRetrySeconds(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setQuotaRetrySeconds((currentValue) =>
        currentValue === null ? null : currentValue - 1,
      );
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [quotaRetrySeconds]);

  const clearFieldError = (fieldName: GenerateFieldName) => {
    setFieldErrors((prev) => {
      if (!prev[fieldName]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  };

  const handleGenerate = async () => {
    setFieldErrors({});
    setError("");

    if (quotaRetrySeconds !== null) {
      setError(
        `Image generation is temporarily rate limited. Try again in about ${quotaRetrySeconds} seconds.`,
      );
      return;
    }

    const validation = validateThumbnailValues({
      title,
      additionalDetails,
      style,
      aspectRatio,
      colorSchemeId,
    });

    if (hasValidationErrors(validation.errors)) {
      setFieldErrors(validation.errors);
      setError(
        validation.errors.style ??
          validation.errors.aspectRatio ??
          validation.errors.colorSchemeId ??
          "",
      );
      return;
    }

    setLoading(true);
    setThumbnail(null);

    try {
      const response = await apiRequest<GenerateThumbnailResponse>(
        "/api/thumbnail/generate",
        {
          method: "POST",
          body: {
            title: validation.values.title,
            prompt: validation.values.additionalDetails,
            style: validation.values.style,
            aspect_ratio: validation.values.aspectRatio,
            color_scheme: validation.values.colorSchemeId,
          },
        },
      );

      setThumbnail(response.thumbnail);
      setQuotaRetrySeconds(null);
      setFieldErrors({});
      navigate(`/generate/${response.thumbnail._id}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      if (error instanceof ApiError && error.status === 422) {
        const payload = error.payload as GenerateErrorPayload | null;
        if (payload?.errors) {
          setFieldErrors(mapGenerateErrors(payload.errors));
        }

        setError(payload?.message ?? "Please correct the highlighted fields.");
        return;
      }

      if (error instanceof ApiError && error.status === 429) {
        const payload = error.payload as GenerateErrorPayload | null;
        const retryAfterSeconds = getRetryAfterSeconds(payload);

        setFieldErrors({});
        setQuotaRetrySeconds(retryAfterSeconds);
        setError("Image generation is temporarily unavailable.");
        return;
      }

      setQuotaRetrySeconds(null);
      setFieldErrors({});
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
      setFieldErrors({});
      setAspectRatio("16:9");
      setColorSchemeId(colorSchemes[0].id);
      setStyle("Bold & Graphic");
      setQuotaRetrySeconds(null);
      return;
    }

    let isCancelled = false;

    const fetchThumbnail = async () => {
      setLoading(true);
      setError("");
      setFieldErrors({});

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
                      onChange={(e) => {
                        setTitle(e.target.value);
                        clearFieldError("title");
                        setError("");
                      }}
                      maxLength={THUMBNAIL_TITLE_MAX_LENGTH}
                      placeholder="e.g., 10 Tips for Better Sleep"
                      className="w-full rounded-lg border border-white/12 bg-black/20 px-4 py-3 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">
                        {title.length}/{THUMBNAIL_TITLE_MAX_LENGTH}
                      </span>
                    </div>
                    {fieldErrors.title && (
                      <p className="text-sm text-rose-300">
                        {fieldErrors.title}
                      </p>
                    )}
                  </div>

                  <AspectedRatioSelector
                    value={aspectRatio}
                    onChange={(value) => {
                      setAspectRatio(value);
                      clearFieldError("aspectRatio");
                      setError("");
                    }}
                  />

                  <StyleSelector
                    value={style}
                    onChange={(value) => {
                      setStyle(value);
                      clearFieldError("style");
                      setError("");
                    }}
                    isOpen={styleDropdownOpen}
                    setIsOpen={setStyleDropdownOpen}
                  />

                  <ColorSchemeSelector
                    value={colorSchemeId}
                    onChange={(value) => {
                      setColorSchemeId(value);
                      clearFieldError("colorSchemeId");
                      setError("");
                    }}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Prompts{" "}
                      <span className="text-xs text-zinc-400">(optional)</span>
                    </label>
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => {
                        setAdditionalDetails(e.target.value);
                        clearFieldError("additionalDetails");
                        setError("");
                      }}
                      rows={3}
                      maxLength={THUMBNAIL_PROMPT_MAX_LENGTH}
                      placeholder="Add any specific elements, mood, or style preferences..."
                      className="w-full resize-none rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">
                        {additionalDetails.length}/{THUMBNAIL_PROMPT_MAX_LENGTH}
                      </span>
                    </div>
                    {fieldErrors.additionalDetails && (
                      <p className="text-sm text-rose-300">
                        {fieldErrors.additionalDetails}
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="text-sm text-rose-300">{error}</p>
                  )}

                  {quotaRetrySeconds !== null && (
                    <p className="text-sm text-amber-200">
                      Try again in about {quotaRetrySeconds} seconds. The image
                      provider is rate limiting requests right now.
                    </p>
                  )}
                </div>

                {!id && (
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !title.trim() || quotaRetrySeconds !== null}
                    className="w-full rounded-xl bg-linear-to-b from-pink-500 to-pink-600 py-3.5 text-[15px] font-medium transition-colors hover:from-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading
                      ? "Generating..."
                      : quotaRetrySeconds !== null
                        ? `Retry in ${quotaRetrySeconds}s`
                        : "Generate Thumbnail"}
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
