import { useSearchParams } from "react-router-dom";
import { yt_html } from "../assets/assets";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const YTPreview = () => {
  const [searchParams] = useSearchParams();

  const thumbnailUrl = searchParams.get("thumbnail_url");
  const title = searchParams.get("title") || "Thumbnail Preview";

  if (!thumbnailUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-zinc-200">
        <div>
          <h1 className="text-xl font-semibold">Preview unavailable</h1>
          <p className="mt-2 text-sm text-zinc-400">
            The thumbnail preview link is missing its image URL.
          </p>
        </div>
      </div>
    );
  }

  const previewHtml = yt_html
    .replace("%%THUMBNAIL_URL%%", escapeHtml(thumbnailUrl))
    .replace("%%TITLE%%", escapeHtml(title));

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <iframe
        title="YouTube thumbnail preview"
        srcDoc={previewHtml}
        className="h-full w-full border-0"
        allowFullScreen
      />
    </div>
  );
};

export default YTPreview;
