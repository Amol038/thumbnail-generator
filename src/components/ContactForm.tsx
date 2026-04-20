import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ArrowRightIcon,
  MailIcon,
  MessageSquareIcon,
  UserIcon,
} from "lucide-react";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const ContactForm = ({
  source,
  showSubject = true,
  submitLabel = "Submit",
  className = "",
}: {
  source: string;
  showSubject?: boolean;
  submitLabel?: string;
  className?: string;
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setFormData((currentData) => ({
      ...currentData,
      name: currentData.name || user?.name || "",
      email: currentData.email || user?.email || "",
    }));
  }, [user]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest<{ message: string }>("/api/contact", {
        method: "POST",
        body: {
          ...formData,
          source,
          subject: showSubject ? formData.subject.trim() : undefined,
        },
      });

      setSuccessMessage(response.message);
      setFormData((currentData) => ({
        ...currentData,
        subject: "",
        message: "",
      }));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit your message right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid w-full gap-4 text-slate-300 sm:grid-cols-2 ${className}`}
    >
      <div>
        <p className="mb-2 font-medium">Your name</p>
        <div className="flex items-center rounded-lg border border-slate-700 pl-3 focus-within:border-pink-500">
          <UserIcon className="size-5" />
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 outline-none"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2 font-medium">Email id</p>
        <div className="flex items-center rounded-lg border border-slate-700 pl-3 focus-within:border-pink-500">
          <MailIcon className="size-5" />
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {showSubject && (
        <div className="sm:col-span-2">
          <p className="mb-2 font-medium">Subject</p>
          <div className="flex items-center rounded-lg border border-slate-700 pl-3 focus-within:border-pink-500">
            <MessageSquareIcon className="size-5" />
            <input
              name="subject"
              type="text"
              placeholder="What can we help you with?"
              className="w-full p-3 outline-none"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      <div className="sm:col-span-2">
        <p className="mb-2 font-medium">Message</p>
        <textarea
          name="message"
          rows={showSubject ? 7 : 6}
          placeholder="Tell us what you need help with, what you want to build, or what issue you are facing..."
          className="w-full resize-none rounded-lg border border-slate-700 p-3 outline-none focus:border-pink-500"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>

      {error && (
        <p className="sm:col-span-2 text-sm text-rose-300">{error}</p>
      )}

      {successMessage && (
        <p className="sm:col-span-2 text-sm text-emerald-300">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-max items-center gap-2 rounded-full bg-pink-600 px-10 py-3 text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending..." : submitLabel}
        <ArrowRightIcon className="size-5" />
      </button>
    </form>
  );
};

export default ContactForm;
