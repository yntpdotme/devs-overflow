"use server";

import {handleError} from "@/lib/handlers";
import {ActionResponse, Country, ErrorResponse, Job} from "@/types";
import {cache} from "react";
import {buildApiUrl} from "../url";

export const fetchLocation = async (): Promise<ActionResponse<string>> => {
  try {
    const response = await fetch("http://ip-api.com/json/?fields=country");

    if (!response.ok) {
      throw new Error(`Failed to fetch location`);
    }

    const {country} = await response.json();

    return {
      success: true,
      data: country.toLowerCase(),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const fetchCountries = cache(
  async (): Promise<ActionResponse<Country[]>> => {
    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch countries`);
      }

      const countries = await response.json();

      return {
        success: true,
        data: JSON.parse(JSON.stringify(countries)),
        status: 200,
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  }
);

export const fetchJobs = async (filters: {
  query: string;
  page?: number;
  pageSize?: number;
}): Promise<ActionResponse<Job[]>> => {
  const {query, page = 1} = filters;

  const apiUrl = buildApiUrl("https://jsearch.p.rapidapi.com/search", {
    query,
    page,
  });

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY ?? "",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Jobs are not available at the moment`);
    }

    const {data: jobs} = await response.json();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(jobs)),
      status: response.status,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
