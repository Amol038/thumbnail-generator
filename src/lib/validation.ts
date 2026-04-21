import {
  aspectRatios,
  colorSchemes,
  thumbnailStyles,
  type AspectRatio,
  type ThumbnailStyle,
} from "../assets/assets";

export const USER_NAME_MIN_LENGTH = 2;
export const USER_NAME_MAX_LENGTH = 50;
export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const THUMBNAIL_TITLE_MIN_LENGTH = 3;
export const THUMBNAIL_TITLE_MAX_LENGTH = 100;
export const THUMBNAIL_PROMPT_MAX_LENGTH = 400;

export type AuthMode = "login" | "register";
export type AuthFieldName = "name" | "email" | "password";
export type AuthFieldErrors = Partial<Record<AuthFieldName, string>>;
export type GenerateFieldName =
  | "title"
  | "additionalDetails"
  | "style"
  | "aspectRatio"
  | "colorSchemeId";
export type GenerateFieldErrors = Partial<Record<GenerateFieldName, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validColorSchemeIds = new Set<string>(colorSchemes.map(({ id }) => id));

const normalizeSingleLineText = (value: string) =>
  value.trim().replace(/\s+/g, " ");

const normalizeMultilineText = (value: string) => value.trim();

export const hasValidationErrors = (
  errors: Record<string, string | undefined>,
) => Object.values(errors).some(Boolean);

export const validateAuthValues = (
  mode: AuthMode,
  values: {
    name: string;
    email: string;
    password: string;
  },
) => {
  const normalizedName = normalizeSingleLineText(values.name);
  const normalizedEmail = values.email.trim().toLowerCase();
  const password = values.password;
  const errors: AuthFieldErrors = {};

  if (mode === "register") {
    if (!normalizedName) {
      errors.name = "Name is required.";
    } else if (normalizedName.length < USER_NAME_MIN_LENGTH) {
      errors.name = `Name must be at least ${USER_NAME_MIN_LENGTH} characters.`;
    } else if (normalizedName.length > USER_NAME_MAX_LENGTH) {
      errors.name = `Name must be ${USER_NAME_MAX_LENGTH} characters or fewer.`;
    }
  }

  if (!normalizedEmail) {
    errors.email = "Email is required.";
  } else if (normalizedEmail.length > EMAIL_MAX_LENGTH) {
    errors.email = `Email must be ${EMAIL_MAX_LENGTH} characters or fewer.`;
  } else if (!emailPattern.test(normalizedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (mode === "register" && password.length < PASSWORD_MIN_LENGTH) {
    errors.password =
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    errors.password =
      `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }

  return {
    errors,
    values: {
      name: normalizedName,
      email: normalizedEmail,
      password,
    },
  };
};

export const validateThumbnailValues = (values: {
  title: string;
  additionalDetails: string;
  style: ThumbnailStyle;
  aspectRatio: AspectRatio;
  colorSchemeId: string;
}) => {
  const normalizedTitle = normalizeSingleLineText(values.title);
  const normalizedAdditionalDetails = normalizeMultilineText(
    values.additionalDetails,
  );
  const errors: GenerateFieldErrors = {};

  if (!normalizedTitle) {
    errors.title = "Please add a video title or topic.";
  } else if (normalizedTitle.length < THUMBNAIL_TITLE_MIN_LENGTH) {
    errors.title =
      `Title must be at least ${THUMBNAIL_TITLE_MIN_LENGTH} characters.`;
  } else if (normalizedTitle.length > THUMBNAIL_TITLE_MAX_LENGTH) {
    errors.title =
      `Title must be ${THUMBNAIL_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (normalizedAdditionalDetails.length > THUMBNAIL_PROMPT_MAX_LENGTH) {
    errors.additionalDetails =
      `Additional details must be ${THUMBNAIL_PROMPT_MAX_LENGTH} characters or fewer.`;
  }

  if (!thumbnailStyles.includes(values.style)) {
    errors.style = "Select a valid thumbnail style.";
  }

  if (!aspectRatios.includes(values.aspectRatio)) {
    errors.aspectRatio = "Select a valid aspect ratio.";
  }

  if (!validColorSchemeIds.has(values.colorSchemeId)) {
    errors.colorSchemeId = "Select a valid color scheme.";
  }

  return {
    errors,
    values: {
      title: normalizedTitle,
      additionalDetails: normalizedAdditionalDetails,
      style: values.style,
      aspectRatio: values.aspectRatio,
      colorSchemeId: values.colorSchemeId,
    },
  };
};
