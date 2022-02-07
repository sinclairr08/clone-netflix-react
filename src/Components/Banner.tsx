import styled from "styled-components";
import { IContent } from "../api";
import { makeImagePath } from "../utils";

const BannerWrapper = styled.div<{ bgphoto: string }>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

interface IBanner {
  content: IContent;
  contentType: string;
}

function Banner({ content, contentType }: IBanner) {
  return (
    <BannerWrapper bgphoto={makeImagePath(content.backdrop_path || "")}>
      <Title>{contentType === "movie" ? content.title : content.name}</Title>
      <Overview>{content.overview}</Overview>
    </BannerWrapper>
  );
}

export default Banner;
