import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Loader2Icon, SaveIcon, SparklesIcon } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SoftBackdrop from "../components/SoftBackdrop";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";

type ProfileResponse = {
  user: {
    _id: string;
    name: string;
    email: string;
    createdAt?: string;
  };
  stats: {
    thumbnailCount: number;
    generatingCount: number;
    latestGenerationAt: string | null;
  };
};

const ProfilePage = () => {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState<ProfileResponse["stats"] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    createdAt: "",
  });

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiRequest<ProfileResponse>("/api/user/profile");
        if (isCancelled) {
          return;
        }

        setFormData({
          name: response.user.name,
          email: response.user.email,
          createdAt: response.user.createdAt ?? "",
        });
        setStats(response.stats);
      } catch (error) {
        if (!isCancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load your profile right now.",
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest<ProfileResponse & { message: string }>(
        "/api/user/profile",
        {
          method: "PATCH",
          body: {
            name: formData.name,
            email: formData.email,
          },
        },
      );

      setFormData((currentData) => ({
        ...currentData,
        name: response.user.name,
        email: response.user.email,
      }));
      setStats(response.stats);
      setSuccess(response.message);
      await refreshUser();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save profile changes.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SoftBackdrop />
      <div className="min-h-screen px-6 pb-20 pt-32 md:px-16 lg:px-24 xl:px-32">
        <PageHeader
          eyebrow="Profile"
          title="Manage your creator account"
          description="Update your basic account details and keep track of how much thumbnail work has moved through your workspace."
        />

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2Icon className="size-8 animate-spin text-zinc-300" />
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-xl md:p-8"
            >
              <h2 className="text-2xl font-semibold text-white">
                Account details
              </h2>
              <p className="mt-2 text-slate-300">
                Keep your name and email current so support and product updates
                reach the right inbox.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              {error && <p className="mt-5 text-sm text-rose-300">{error}</p>}
              {success && (
                <p className="mt-5 text-sm text-emerald-300">{success}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-7 flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <SaveIcon className="size-4" />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-pink-400">
                  Snapshot
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
                    <p className="text-sm text-zinc-400">Thumbnails created</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {stats?.thumbnailCount ?? 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
                    <p className="text-sm text-zinc-400">Currently generating</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {stats?.generatingCount ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-pink-950/35 p-6">
                <div className="flex items-start gap-3">
                  <SparklesIcon className="mt-1 size-5 text-pink-300" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Account activity
                    </h3>
                    <p className="mt-2 leading-7 text-slate-200">
                      Member since{" "}
                      {formData.createdAt
                        ? new Date(formData.createdAt).toDateString()
                        : "recently"}
                      . Latest thumbnail generation{" "}
                      {stats?.latestGenerationAt
                        ? new Date(stats.latestGenerationAt).toDateString()
                        : "has not happened yet"}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
