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

function Home() {
  const contentType = "movie";
  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useQuery<IGetContentsResult>([contentType, "nowPlaying"], () =>
      getResults(contentType, "now_playing")
    );

  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<IGetContentsResult>([contentType, "topRated"], () =>
      getResults(contentType, "top_rated")
    );

  const { data: upComingData, isLoading: upComingLoading } =
    useQuery<IGetContentsResult>([contentType, "upComing"], () =>
      getResults(contentType, "upcoming")
    );

  const { data: latestData, isLoading: latestLoading } = useQuery<IContent>(
    [contentType, "latest"],
    () => getResults(contentType, "latest")
  );

  const isLoading =
    nowPlayingLoading && topRatedLoading && upComingLoading && latestLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {nowPlayingData && (
            <>
              <Banner
                contentType={contentType}
                content={nowPlayingData.results[0]}
              />
              <Slider
                name="Now Playing Movies"
                contents={nowPlayingData.results.slice(1)}
                contentType={contentType}
              />
            </>
          )}
          {topRatedData && (
            <Slider
              name="Top Rated Movies"
              contents={topRatedData.results}
              contentType={contentType}
            />
          )}

          {upComingData && (
            <Slider
              name="Upcoming Movies"
              contents={upComingData.results}
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
export default Home;
