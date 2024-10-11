import {NextResponse} from "next/server";

export type Tag = {
  _id: string;
  name: string;
};

export type Author = {
  _id: string;
  name: string;
  image: string;
};

export type Question = {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
};

export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

export type SuccessResponse<T = null> = ActionResponse<T> & {success: true};

export type ErrorResponse = ActionResponse<undefined> & {success: false};

export type APIErrorResponse = NextResponse<ErrorResponse>;

export type APIResponse<T = null> = NextResponse<
  SuccessResponse<T> | ErrorResponse
>;

export type SignInWithOAuthParams = {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
};

export type AuthCredentials = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type CreateQuestionParams = {
  title: string;
  content: string;
  tags: string[];
};

export type RouteParams = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};

export type GetQuestionParams = {
  questionId: string;
};

export type EditQuestionParams = CreateQuestionParams & {
  questionId: string;
};

export type PaginatedSearchParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
};

export type GetTagQuestionsParams = Omit<PaginatedSearchParams, "filter"> & {
  tagId: string;
};

export type IncrementViewsParams = {
  questionId: string;
};

export type CreateAnswerParams = {
  questionId: string;
  content: string;
};

export type GetAnswersParams = PaginatedSearchParams & {
  questionId: string;
};

export type Answer = {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
};

export type CreateVoteParams = {
  actionId: string;
  actionType: "question" | "answer";
  voteType: "upvote" | "downvote";
};

export type UpdateVoteCountParams = CreateVoteParams & {
  change: 1 | -1;
};

export type HasVotedParams = Pick<CreateVoteParams, "actionId" | "actionType">;

export type HasVotedResponse = {
  hasUpVoted: boolean;
  hasDownVoted: boolean;
};

export type CollectionBaseParams = {
  questionId: string;
};

export type Collection = {
  _id: string;
  author: string | Author;
  question: Question;
};

export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
};
