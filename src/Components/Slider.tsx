import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getResults, IContent } from "../api";
import { makeImagePath } from "../utils";
import SliderClickedBox from "./SliderClickedBox";

const SliderWrapper = styled.div`
  position: relative;
  top: -100px;
  margin-left: 10px;
  margin-bottom: 250px;
`;

const SliderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
`;

const SliderHeaderTitle = styled.h1`
  font-size: 36px;
`;

const SliderMoveBtn = styled.button`
  background-color: ${(props) => props.theme.black.darker};
  color: ${(props) => props.theme.white.lighter};
  border-radius: 10px;
  border: none;
  padding: 2px 5px;
  margin-top: 8px;
  margin-left: 7px;
  font-size: 14px;
`;

const SliderRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const SliderBox = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duraton: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duraton: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

interface ISlider {
  contents: IContent[];
  contentType: string;
  name: string;
}

function Slider({ contents, contentType, name }: ISlider) {
  const history = useHistory();
  const location = useLocation();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);

  const totalMovies = contents.length;
  const maxIndex = Math.floor(totalMovies / offset) - 1;

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    setBack(false);
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const decreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    setBack(true);
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };
  const onBoxClicked = (contentId: number) => {
    if (location.pathname === "/search") {
      if (contentType === "movie") {
        history.push(`/search${location.search}&movie=${contentId}`);
      } else {
        history.push(`/search${location.search}&tv=${contentId}`);
      }
    } else {
      if (contentType === "movie") {
        history.push(`/movies/${contentId}`);
      } else {
        history.push(`/tvs/${contentId}`);
      }
    }
  };

  const clickedMovieMatch =
    useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const clickedTvMatch = useRouteMatch<{ tvId: string }>("/tvs/:tvId");

  console.log(clickedMovieMatch);

  const clickedMovie =
    clickedMovieMatch?.params.movieId &&
    contents.find(
      (content) => content.id === +clickedMovieMatch.params.movieId
    );

  const clickedTv =
    clickedTvMatch?.params.tvId &&
    contents.find((content) => content.id === +clickedTvMatch.params.tvId);

  return (
    <>
      <SliderWrapper>
        <SliderHeader>
          <SliderHeaderTitle>{name}</SliderHeaderTitle>
          <SliderMoveBtn onClick={decreaseIndex}>prev</SliderMoveBtn>
          <SliderMoveBtn onClick={increaseIndex}>next</SliderMoveBtn>
        </SliderHeader>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={back}
        >
          <SliderRow
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={name + index}
            custom={back}
          >
            {contents
              .slice(offset * index, offset * index + offset)
              .map((content) => (
                <SliderBox
                  layoutId={name + contentType + content.id}
                  key={name + contentType + content.id}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  onClick={() => onBoxClicked(content.id)}
                  transition={{ type: "tween" }}
                  bgphoto={makeImagePath(
                    content.backdrop_path
                      ? content.backdrop_path
                      : content.poster_path
                      ? content.poster_path
                      : "",
                    "w500"
                  )}
                >
                  <Info variants={infoVariants}>
                    <h4>
                      {contentType === "movie" ? content.title : content.name}
                    </h4>
                  </Info>
                </SliderBox>
              ))}
          </SliderRow>
        </AnimatePresence>
      </SliderWrapper>
      {clickedMovieMatch && clickedMovie ? (
        <SliderClickedBox
          name={name}
          contentType={contentType}
          contentId={+clickedMovieMatch.params.movieId}
          clickedContent={clickedMovie}
        />
      ) : null}

      {clickedTvMatch && clickedTv ? (
        <SliderClickedBox
          name={name}
          contentType={contentType}
          contentId={+clickedTvMatch.params.tvId}
          clickedContent={clickedTv}
        />
      ) : null}
    </>
  );
}

export default Slider;
