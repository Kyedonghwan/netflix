import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
    background: black;
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
    background-size: center center;
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
    const {data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

    const [index, setIndex] = useState(0);

    const [leaving, setLeaving ] =useState(false);

    const offset= 6;

    const rowClick = () => {
        if(data){
            if( leaving ) return;
            setLeaving(true);
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) -1 ;
            setIndex(prev => prev===maxIndex ? 0 :prev+1);
        }
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
                                {data?.results.slice(1).slice(offset*index, offset*index+offset).map(movie => <Box whileHover="hover" variants={boxVariant} transition={{ type: "tween"}} initial="normal" bgPhoto={makeImagePath(movie.backdrop_path || "","w500")} key={movie.id+""} >
                                    <Info variants={infoVariant}>
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>)}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>
            )}
        </Wrapper>
    );
}