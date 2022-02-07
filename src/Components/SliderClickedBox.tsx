import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getDetailResults, IContent, IGetDetailResult } from "../api";
import { makeImagePath, makeOverviewShorten } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 98;
`;

const ClickedBox = styled(motion.div)`
  z-index: 99;
  position: absolute;
  width: 40vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const ClickedBoxCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const ClickedBoxTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  position: relative;
  top: -100px;
`;

const ClickedBoxItems = styled.div`
  padding: 20px;
`;

const ClickedBoxSubTitle = styled.h4`
  position: relative;
  top: -70px;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
`;

const ClickedBoxOverview = styled.p`
  position: relative;
  top: -60px;
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
`;

const ClickedBoxDetailItems = styled.div`
  position: relative;
  top: -30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const ClickedBoxDetailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 10px;
`;

const DItemName = styled.span`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
`;

const DItemValue = styled.span`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${(props) => props.theme.orange};
  font-size: 18px;
`;

interface IClickedBox {
  contentType: string;
  contentId: number;
  clickedContent: IContent;
  name: string;
}

function SliderClickedBox({
  name,
  contentType,
  contentId,
  clickedContent,
}: IClickedBox) {
  const history = useHistory();
  const location = useLocation();

  const { scrollY } = useViewportScroll();
  const searchKeyword = new URLSearchParams(location.search).get("keyword");

  const { data: detailData, isLoading: detailLoading } =
    useQuery<IGetDetailResult>([contentType, "detail"], () =>
      getDetailResults(contentType, contentId)
    );

  const onOverlayClicked = () => {
    if (location.pathname === "/search") {
      history.push(`/search?keyword=${searchKeyword}`);
    } else {
      if (contentType === "movie") {
        history.push("/");
      } else {
        history.push("/tv");
      }
    }
  };
  return (
    <>
      <AnimatePresence>
        <Overlay
          onClick={onOverlayClicked}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <ClickedBox
          key={name + contentType + contentId}
          /*layoutId={name + contentType + contentId}*/
          style={{
            top: scrollY.get() + 100,
          }}
        >
          <>
            <ClickedBoxCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                  clickedContent.backdrop_path
                    ? clickedContent.backdrop_path
                    : clickedContent.poster_path
                    ? clickedContent.poster_path
                    : "",
                  "w500"
                )}`,
              }}
            />
            <ClickedBoxItems>
              <ClickedBoxTitle>
                {contentType === "movie"
                  ? clickedContent.title
                  : clickedContent.name}
              </ClickedBoxTitle>
              <ClickedBoxSubTitle>OverView</ClickedBoxSubTitle>
              <ClickedBoxOverview>
                {makeOverviewShorten(clickedContent.overview)}
              </ClickedBoxOverview>
              <ClickedBoxDetailItems>
                <ClickedBoxDetailItem>
                  <DItemName>Rating Average</DItemName>
                  <DItemValue>{`${clickedContent.vote_average} (${clickedContent.vote_count} votes) `}</DItemValue>
                </ClickedBoxDetailItem>
                <ClickedBoxDetailItem>
                  <DItemName>Popularity</DItemName>
                  <DItemValue>{clickedContent.popularity}</DItemValue>
                </ClickedBoxDetailItem>
                <ClickedBoxDetailItem>
                  <DItemName>Relase date</DItemName>
                  <DItemValue>
                    {contentType === "movie"
                      ? clickedContent.release_date
                      : clickedContent.first_air_date}
                  </DItemValue>
                </ClickedBoxDetailItem>

                {contentType === "tv" &&
                detailData?.created_by &&
                detailData.created_by.length > 0 ? (
                  <ClickedBoxDetailItem style={{ gridColumn: "1 / span 3" }}>
                    <DItemName>Creted by</DItemName>
                    <DItemValue>
                      {detailData?.created_by.map((creator) => (
                        <span>{creator.name}</span>
                      ))}
                    </DItemValue>
                  </ClickedBoxDetailItem>
                ) : null}

                {detailData?.genres && detailData.genres.length > 0 ? (
                  <ClickedBoxDetailItem style={{ gridColumn: "1 / span 3" }}>
                    <DItemName>Genres</DItemName>
                    <DItemValue>
                      {detailData?.genres.map((genre) => (
                        <span>{genre.name}</span>
                      ))}
                    </DItemValue>
                  </ClickedBoxDetailItem>
                ) : null}

                {detailData?.production_companies &&
                detailData.production_companies.length > 0 ? (
                  <ClickedBoxDetailItem style={{ gridColumn: "1 / span 3" }}>
                    <DItemName>Companies</DItemName>
                    <DItemValue>
                      {detailData?.production_companies.map((company) => (
                        <span>{company.name}</span>
                      ))}
                    </DItemValue>
                  </ClickedBoxDetailItem>
                ) : null}
              </ClickedBoxDetailItems>
            </ClickedBoxItems>
          </>
        </ClickedBox>
      </AnimatePresence>
    </>
  );
}

export default SliderClickedBox;
