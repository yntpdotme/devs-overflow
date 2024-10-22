import {createAnswer, getAnswers} from "./answer.action";
import {
  signInAsGuest,
  signInWithCredentials,
  signUpWithCredentials,
} from "./auth.action";
import {
  getSavedQuestions,
  hasSavedQuestion,
  toggleSaveQuestion,
} from "./collection.action";
import {
  createQuestion,
  editQuestion,
  getHotQuestions,
  getQuestion,
  getQuestions,
  incrementViews,
} from "./question.action";
import {getTagQuestions, getTags, getTopTags} from "./tag.action";
import {getUsers} from "./user.action";
import {createVote, hasVoted, updateVoteCount} from "./vote.action";

export {
  createAnswer,
  createQuestion,
  createVote,
  editQuestion,
  getAnswers,
  getHotQuestions,
  getQuestion,
  getQuestions,
  getSavedQuestions,
  getTagQuestions,
  getTags,
  getTopTags,
  getUsers,
  hasSavedQuestion,
  hasVoted,
  incrementViews,
  signInAsGuest,
  signInWithCredentials,
  signUpWithCredentials,
  toggleSaveQuestion,
  updateVoteCount,
};
