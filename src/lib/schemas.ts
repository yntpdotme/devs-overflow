import {InteractionActionEnums} from "@/database/interaction.model";
import {z} from "zod";

export const SignInSchema = z.object({
  email: z.string().email({message: "Please provide a valid email address."}),
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters long."})
    .max(100, {message: "Password cannot exceed 100 characters."}),
});

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(1, {message: "Name is required."})
    .max(50, {message: "Name cannot exceed 50 characters."})
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  username: z
    .string()
    .min(3, {message: "Username must be at least 3 characters long."})
    .max(30, {message: "Username cannot exceed 30 characters."}),
  email: z.string().email({message: "Please provide a valid email address."}),
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters long."})
    .max(100, {message: "Password cannot exceed 100 characters."})
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {message: "Password must contain at least one number."})
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, {message: "Title must be at least 5 characters long."})
    .max(100, {message: "Title cannot exceed 100 characters."}),
  content: z
    .string()
    .min(50, {message: "Content has to have more than 50 characters."}),
  tags: z
    .array(
      z
        .string()
        .min(1, {message: "Tag is required."})
        .max(30, {message: "Tag cannot exceed 30 characters."})
    )
    .min(1, {message: "At least one tag is required."})
    .max(3, {message: "Cannot add more than 3 tags."}),
});

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, {message: "Name is required."})
    .max(50, {message: "Name cannot exceed 50 characters."})
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  username: z
    .string()
    .min(3, {message: "Username must be at least 3 characters long."})
    .max(30, {message: "Username cannot exceed 30 characters."}),
  email: z.string().email({message: "Please provide a valid email address."}),
  bio: z.string().optional(),
  image: z
    .string()
    .url({message: "Please provide a valid image URL."})
    .optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({message: "Please provide a valid portfolio URL."})
    .optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "User ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "User ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid userId"}),
  name: z
    .string()
    .min(1, {message: "Name is required."})
    .max(50, {message: "Name cannot exceed 50 characters."})
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  image: z
    .string()
    .url({message: "Please provide a valid image URL."})
    .optional(),
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters long."})
    .max(100, {message: "Password cannot exceed 100 characters."})
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {message: "Password must contain at least one number."})
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, {message: "Provider is required."}),
  providerAccountId: z
    .string()
    .min(1, {message: "Provider Account ID is required."}),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, {message: "Provider Account ID is required."}),
  user: z.object({
    name: z
      .string()
      .min(1, {message: "Name is required."})
      .max(50, {message: "Name cannot exceed 50 characters."})
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name can only contain letters and spaces.",
      }),
    username: z
      .string()
      .min(3, {message: "Username must be at least 3 characters long."})
      .max(30, {message: "Username cannot exceed 30 characters."}),

    email: z.string().email({message: "Please provide a valid email address."}),
    image: z
      .string()
      .url({message: "Please provide a valid image URL."})
      .optional(),
  }),
});

export const GetQuestionSchema = z.object({
  questionId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Question ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Question ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid questionId"}),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Question ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Question ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid questionId"}),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Tag ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Tag ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid tagId"}),
});

export const IncrementViewsSchema = z.object({
  questionId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Question ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Question ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid questionId"}),
});

export const SubmitAnswerSchema = z.object({
  content: z
    .string()
    .min(100, {message: "Answer has to have more than 100 characters."}),
});

export const AnswerSchema = SubmitAnswerSchema.extend({
  questionId: z.string().min(1, {message: "Question ID is required."}),
});

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Question ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Question ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid questionId"}),
});

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, {message: "Question must be at least 5 characters long."})
    .max(100, {message: "Question cannot exceed 100 characters."}),
  content: z.string().min(50, {
    message: "Question content has to have more than 50 characters.",
  }),
  userAnswer: z.string().optional(),
});

export const CreateVoteSchema = z.object({
  actionId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Action ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Action ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid actionId"}),
  actionType: z.enum(["question", "answer"], {
    message: "Invalid action type.",
  }),
  voteType: z.enum(["upvote", "downvote"], {message: "Invalid vote type."}),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.number().int().min(-1).max(1),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  actionId: true,
  actionType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Question ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Question ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid questionId"}),
});

export const GetUserSchema = z.object({
  userId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "User ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "User ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid userId"}),
});

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.omit({
  query: true,
  filter: true,
  sort: true,
}).extend({
  userId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "User ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "User ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid userId"}),
});

export const GetUserAnswersSchema = PaginatedSearchParamsSchema.omit({
  query: true,
  filter: true,
  sort: true,
}).extend({
  userId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "User ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "User ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid userId"}),
});

export const GetUserTagsSchema = z.object({
  userId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "User ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "User ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid userId"}),
});

export const DeleteQuestionSchema = z.object({
  questionId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Question ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Question ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid questionId"}),
});

export const DeleteAnswerSchema = z.object({
  answerId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Answer ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Answer ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid answerId"}),
});

export const CreateInteractionSchema = z.object({
  action: z.enum(InteractionActionEnums, {
    message: "Invalid action.",
  }),
  actionId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Action ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Action ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid actionId"}),
  actionType: z.enum(["question", "answer"], {
    message: "Invalid action type.",
  }),
  authorId: z
    .string({
      // eslint-disable-next-line camelcase
      required_error: "Author ID is required.",
      // eslint-disable-next-line camelcase
      invalid_type_error: "Author ID must be a string.",
    })
    .refine(val => val.length === 24, {message: "Invalid userId"}),
});
