import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2Icon } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import SoftBackdrop from "./SoftBackdrop";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USER_NAME_MAX_LENGTH,
  hasValidationErrors,
  validateAuthValues,
  type AuthFieldErrors,
  type AuthFieldName,
  type AuthMode,
} from "../lib/validation";

type AuthErrorPayload = {
  errors?: AuthFieldErrors;
  message?: string;
};

const Login = () => {
  const [state, setState] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, login, register } = useAuth();

  const redirectTo = (() => {
    const stateFromLocation = location.state as { from?: string } | null;
    return stateFromLocation?.from || "/generate";
  })();

  const clearFieldError = (fieldName: AuthFieldName) => {
    setFieldErrors((prev) => {
      if (!prev[fieldName]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name as AuthFieldName);
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const validation = validateAuthValues(state, formData);
    if (hasValidationErrors(validation.errors)) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    try {
      if (state === "login") {
        await login({
          email: validation.values.email,
          password: validation.values.password,
        });
      } else {
        await register({
          name: validation.values.name,
          email: validation.values.email,
          password: validation.values.password,
        });
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        const payload = error.payload as AuthErrorPayload | null;
        if (payload?.errors) {
          setFieldErrors(payload.errors);
        }
      }

      setError(
        error instanceof Error ? error.message : "Authentication failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <SoftBackdrop />
        <div className="flex min-h-screen items-center justify-center text-zinc-200">
          <Loader2Icon className="size-8 animate-spin" />
        </div>
      </>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <>
      <SoftBackdrop />
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-white/10 bg-white/6 px-8 text-center sm:w-[350px]"
        >
          <h1 className="mt-10 text-3xl font-medium text-white">
            {state === "login" ? "Login" : "Sign up"}
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            {state === "login"
              ? "Please sign in to continue"
              : "Create your account to start generating thumbnails"}
          </p>

          {state !== "login" && (
            <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full bg-white/5 pl-6 ring-2 ring-white/10 transition-all focus-within:ring-pink-500/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-white/60"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full border-none bg-transparent text-white outline-none placeholder:text-white/60"
                value={formData.name}
                onChange={handleChange}
                maxLength={USER_NAME_MAX_LENGTH}
                autoComplete="name"
                required
              />
            </div>
          )}

          {state !== "login" && fieldErrors.name && (
            <p className="mt-2 text-left text-sm text-rose-300">
              {fieldErrors.name}
            </p>
          )}

          <div className="mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full bg-white/5 pl-6 ring-2 ring-white/10 transition-all focus-within:ring-pink-500/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-white/75"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email id"
              className="w-full border-none bg-transparent text-white outline-none placeholder:text-white/60"
              value={formData.email}
              onChange={handleChange}
              maxLength={EMAIL_MAX_LENGTH}
              autoComplete="email"
              required
            />
          </div>

          {fieldErrors.email && (
            <p className="mt-2 text-left text-sm text-rose-300">
              {fieldErrors.email}
            </p>
          )}

          <div className="mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full bg-white/5 pl-6 ring-2 ring-white/10 transition-all focus-within:ring-indigo-500/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-white/75"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border-none bg-transparent text-white outline-none placeholder:text-white/60"
              value={formData.password}
              onChange={handleChange}
              maxLength={PASSWORD_MAX_LENGTH}
              autoComplete={state === "login" ? "current-password" : "new-password"}
              required
            />
          </div>

          {fieldErrors.password && (
            <p className="mt-2 text-left text-sm text-rose-300">
              {fieldErrors.password}
            </p>
          )}

          {state !== "login" && (
            <p className="mt-2 text-left text-xs text-zinc-400">
              Use {PASSWORD_MIN_LENGTH}-{PASSWORD_MAX_LENGTH} characters.
            </p>
          )}

          {error && (
            <p className="mt-4 text-left text-sm text-rose-300">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 h-11 w-full rounded-full bg-pink-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting
              ? "Please wait..."
              : state === "login"
                ? "Login"
                : "Sign up"}
          </button>

          <p
            onClick={() => {
              setState((prev) => (prev === "login" ? "register" : "login"));
              setError("");
              setFieldErrors({});
            }}
            className="mb-11 mt-3 cursor-pointer text-sm text-gray-400"
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span className="ml-1 text-pink-400 hover:underline">
              click here
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
