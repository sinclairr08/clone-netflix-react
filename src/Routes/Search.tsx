import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetContentsResult } from "../api";
import Slider from "../Components/Slider";

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

const Hollow = styled.div`
  height: 25vh;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: searchMovieData, isLoading: searchMovieLoading } =
    useQuery<IGetContentsResult>(["movie", "search", keyword], () =>
      getSearch("movie", keyword ? keyword : "")
    );

  const { data: searchTvData, isLoading: searchTvLoading } =
    useQuery<IGetContentsResult>(["tv", "search", keyword], () =>
      getSearch("tv", keyword ? keyword : "")
    );

  const isLoading = searchMovieLoading && searchTvLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Hollow />
          {searchMovieData && (
            <Slider
              name={`Movie results for "${keyword}"`}
              contents={searchMovieData.results}
              contentType="movie"
            />
          )}
          {searchTvData && (
            <Slider
              name={`Tv results for "${keyword}"`}
              contents={searchTvData.results}
              contentType="tv"
            />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Search;
