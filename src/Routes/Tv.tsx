import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getResults, IContent, IGetContentsResult } from "../api";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Tv() {
  const contentType = "tv";
  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<IGetContentsResult>([contentType, "topRated"], () =>
      getResults(contentType, "top_rated")
    );

  const { data: airingTodayData, isLoading: airingTodayLoading } =
    useQuery<IGetContentsResult>([contentType, "airingToday"], () =>
      getResults(contentType, "airing_today")
    );

  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetContentsResult>([contentType, "popular"], () =>
      getResults(contentType, "popular")
    );

  const { data: latestData, isLoading: latestLoading } = useQuery<IContent>(
    [contentType, "latest"],
    () => getResults(contentType, "latest")
  );

  const isLoading =
    topRatedLoading && airingTodayLoading && popularLoading && latestLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {popularData && (
            <>
              <Banner
                content={popularData.results[0]}
                contentType={contentType}
              />
              <Slider
                name="Popular"
                contents={popularData.results.slice(1)}
                contentType={contentType}
              />
            </>
          )}
          {topRatedData && (
            <Slider
              name="Top Rated"
              contents={topRatedData.results}
              contentType={contentType}
            />
          )}
          {airingTodayData && (
            <Slider
              name="Airing Today"
              contents={airingTodayData.results}
              contentType={contentType}
            />
          )}
          {latestData && (
            <Slider
              name="Latest"
              contents={[latestData]}
              contentType={contentType}
            />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
