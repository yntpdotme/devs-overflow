import {createAnswer, deleteAnswer, getAnswers} from "./answer.action";
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
import {globalSearch} from "./general.action";
import {createInteraction} from "./interaction.action";
import {fetchCountries, fetchJobs, fetchLocation} from "./job.action";
import {
  createQuestion,
  deleteQuestion,
  editQuestion,
  getHotQuestions,
  getQuestion,
  getQuestions,
  incrementViews,
} from "./question.action";
import {getTagQuestions, getTags, getTopTags} from "./tag.action";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserStats,
  getUserTopTags,
  getUsers,
} from "./user.action";
import {createVote, hasVoted, updateVoteCount} from "./vote.action";

export {
  createAnswer,
  createInteraction,
  createQuestion,
  createVote,
  deleteAnswer,
  deleteQuestion,
  editQuestion,
  fetchCountries,
  fetchJobs,
  fetchLocation,
  getAnswers,
  getHotQuestions,
  getQuestion,
  getQuestions,
  getSavedQuestions,
  getTagQuestions,
  getTags,
  getTopTags,
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserStats,
  getUserTopTags,
  getUsers,
  globalSearch,
  hasSavedQuestion,
  hasVoted,
  incrementViews,
  signInAsGuest,
  signInWithCredentials,
  signUpWithCredentials,
  toggleSaveQuestion,
  updateVoteCount,
};
