import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    background: black;
    height: 200vh;
`

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Banner = styled.div<{bgPhoto : string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image:linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.bgPhoto});
    background-size : cover;
`

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`

const Overview = styled.p`
    font-size: 36px; 
    width: 50%;
    height: 2000px;
`

const Slider = styled.div`
    position: relative;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    margin-bottom: 10px;
    position: absolute;
    width: 100%;
    top: -200px;
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
    height: 200px;
    background-image: url("${props=> props.bgPhoto}");
    background-size: cover;
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
    background-color: ${props => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;

    h4 {
        text-align: center;
        font-size: 18px;
    }
`

const Overlay = styled(motion.div)`
    position: fixed;
    background-color: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
`

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 500px;
    height: 513px;
    background-color: ${props => props.theme.black.darker};
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
`

const BigMovieDetail = styled.div`
    div {
        position: relative;
        border-radius: 15px;
        overflow: hidden;
        white-space: nowrap;

        &::before {
            border-radius: 15px;
            position: absolute;
            content: "";
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border: 1px solid ${props => props.theme.white.darker};
        }

        &::after {
            content: "";
            position: absolute;
            top: 10px;
            bottom: 0;
            width: 100%;
            background-image: linear-gradient(transparent, black);
        }

        img {
            display: block;
            width: 100%;
        }
    }

    h2 {    
        font-size: 30px;
        text-align: center;
        font-weight: 700;
        margin: 30px 0;
    }

    p {
        padding: 20px;
    }
`

const rowVariant = {
    invisible: {
        x: window.outerWidth + 10
    },
    visible: {
        x: 0
    },
    exit: {
        x: -window.outerWidth - 10
    }
}

const boxVariant = {
    normal: {
        scale: 1
    },
    hover: {
        scale: 1.3,
        y: -80,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween"
        }
    }
}

const infoVariant = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween"
        }
    }
}

export default function Home () {
    const history = useNavigate();

    const bigMovieMatch = useMatch("/movies/:movieId");

    const {data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

    const [index, setIndex] = useState(0);

    const [leaving, setLeaving ] =useState(false);

    const offset= 6;

    const { scrollY } = useViewportScroll();

    const rowClick = () => {
        if(data) {
            if( leaving ) return;
            setLeaving(true);
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) -1 ;
            setIndex(prev => prev===maxIndex ? 0 :prev+1);
        }
    }

    const movieData = bigMovieMatch?.params.movieId && data?.results.find(item => item.id+"" === bigMovieMatch.params.movieId);

    const onBoxClicked = (movieId: number) => {
        history(`/movies/${movieId}`);
    }

    return (
        <Wrapper>
            {isLoading ? <Loader></Loader> : (
                <>
                    <Banner onClick={rowClick} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={() => setLeaving((prev) => !prev)}>
                            <Row variants={rowVariant} key={index} transition={{ type: "tween", duration: 1 }} initial="invisible" animate="visible" exit="exit">
                                {data?.results.slice(1).slice(offset*index, offset*index+offset).map(movie => <Box layoutId={movie.id+""} onClick={()=> onBoxClicked(movie.id)} whileHover="hover" variants={boxVariant} transition={{ type: "tween"}} initial="normal" bgPhoto={makeImagePath(movie.backdrop_path || "","w500")} key={movie.id+""} >
                                    <Info variants={infoVariant}>
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>)}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <Overlay animate={{opacity: 1}} exit={{opacity: 0}} onClick={()=> history("/")}>
                                <BigMovie style={{ top : scrollY.get() + 100 }} layoutId={bigMovieMatch.params.movieId} >
                                    { movieData && <BigMovieDetail>
                                        <div>
                                            <img src={makeImagePath(movieData.backdrop_path , "w500")} />
                                        </div>
                                        <h2>{movieData.title}</h2>
                                        <p>{movieData.overview}</p>
                                    </BigMovieDetail>
                                    
                                    }
                                </BigMovie>
                            </Overlay>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}