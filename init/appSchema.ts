import * as Yup from "yup";

export const signInSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .test("no-leading-space", "Email cannot start with a space.", (value) =>
      value ? value[0] !== " " : false,
    )
    .test(
      "no-internal-or-trailing-space",
      "Email cannot contain spaces.",
      (value) => (value ? value.trim() === value && !/\s/.test(value) : false),
    )
    .matches(
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      "Invalid email format.",
    )
    .test("no-dot-before-at", "Email cannot have a dot before @.", (value) =>
      value ? !/\.@/.test(value) : false,
    )
    .test(
      "no-dot-or-hyphen-after-at",
      "Domain cannot start with dot or hyphen.",
      (value) => {
        const domain = value?.split("@")[1];
        return domain ? !/^[.-]/.test(domain) : false;
      },
    ),

  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must contain at least 8 alphanumeric characters.")
    .required("Please enter your password"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .test("no-leading-space", "Email cannot start with a space.", (value) =>
      value ? value[0] !== " " : false,
    )
    .test(
      "no-internal-or-trailing-space",
      "Email cannot contain spaces.",
      (value) => (value ? value.trim() === value && !/\s/.test(value) : false),
    )
    .matches(
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      "Invalid email format.",
    )
    .test("no-dot-before-at", "Email cannot have a dot before @.", (value) =>
      value ? !/\.@/.test(value) : false,
    )
    .test(
      "no-dot-or-hyphen-after-at",
      "Domain cannot start with dot or hyphen.",
      (value) => {
        const domain = value?.split("@")[1];
        return domain ? !/^[.-]/.test(domain) : false;
      },
    ),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Please enter your password")
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must contain at least 8 characters")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/\d/, "Password must include at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character",
    ),

  cPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Password does not match"),
});

export const createChallengeSchema = Yup.object({
  name: Yup.string()
    .required("Challenge name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  endDate: Yup.date()
    .required("End date is required")
    .min(new Date(), "End date must be in the future"),

  image: Yup.mixed<File>()
    .required("Image is required")
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return false;
      return value instanceof File && value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return false;
      return (
        value instanceof File &&
        ["image/jpeg", "image/png"].includes(value.type)
      );
    }),
});

export const sendNotificationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  role: Yup.string()
    .required("Role is required")
    .oneOf(["USER", "SERVICE_PROVIDER", "EVENT_ORGANIZER"], "Invalid role"),
});
