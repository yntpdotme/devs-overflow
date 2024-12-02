import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

import {BADGE_CRITERIA} from "@/constants";
import {techDescriptionMap} from "@/constants/techDescriptionMap";
import {techMap} from "@/constants/techMap";
import {Badges} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    {label: "year", seconds: 31536000},
    {label: "month", seconds: 2592000},
    {label: "week", seconds: 604800},
    {label: "day", seconds: 86400},
    {label: "hour", seconds: 3600},
    {label: "minute", seconds: 60},
    {label: "second", seconds: 1},
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

export const getTechDescription = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return techDescriptionMap[normalizedTechName]
    ? techDescriptionMap[normalizedTechName]
    : `${techName} is a technology or tool widely used in development, providing valuable features and capabilities.`;
};

export const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

export const assignBadges = (params: {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}) => {
  const badgeCounts: Badges = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const {criteria} = params;

  criteria.forEach(item => {
    const {type, count} = item;
    const badgeLevels = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach(level => {
      if (count >= badgeLevels[level as keyof typeof badgeLevels]) {
        badgeCounts[level as keyof Badges] += 1;
      }
    });
  });

  return badgeCounts;
};

export const processJobTitle = (title: string | undefined | null): string => {
  if (title === undefined || title === null) {
    return "No Job Title";
  }

  const words = title.split(" ");

  const validWords = words.filter(word => {
    return (
      word !== undefined &&
      word !== null &&
      word.toLowerCase() !== "undefined" &&
      word.toLowerCase() !== "null"
    );
  });

  if (validWords.length === 0) {
    return "No Job Title";
  }

  const processedTitle = validWords.join(" ");

  return processedTitle;
};
