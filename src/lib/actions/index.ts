import {createAnswer, getAnswers} from "./answer.action";
import {
  signInAsGuest,
  signInWithCredentials,
  signUpWithCredentials,
} from "./auth.action";
import {hasSavedQuestion, toggleSaveQuestion} from "./collection.action";
import {
  createQuestion,
  editQuestion,
  getQuestion,
  getQuestions,
  incrementViews,
} from "./question.action";
import {getTagQuestions, getTags} from "./tag.action";
import {createVote, hasVoted, updateVoteCount} from "./vote.action";

export {
  createAnswer,
  createQuestion,
  createVote,
  editQuestion,
  getAnswers,
  getQuestion,
  getQuestions,
  getTagQuestions,
  getTags,
  hasSavedQuestion,
  hasVoted,
  incrementViews,
  signInAsGuest,
  signInWithCredentials,
  signUpWithCredentials,
  toggleSaveQuestion,
  updateVoteCount,
};
