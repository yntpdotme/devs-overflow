import {createAnswer} from "./answer.action";
import {
  signInAsGuest,
  signInWithCredentials,
  signUpWithCredentials,
} from "./auth.action";
import {
  createQuestion,
  editQuestion,
  getQuestion,
  getQuestions,
  incrementViews,
} from "./question.action";
import {getTagQuestions, getTags} from "./tag.action";

export {
  createAnswer,
  createQuestion,
  editQuestion,
  getQuestion,
  getQuestions,
  getTagQuestions,
  getTags,
  incrementViews,
  signInAsGuest,
  signInWithCredentials,
  signUpWithCredentials,
};
