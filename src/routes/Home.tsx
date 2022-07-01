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
`;

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
                                {data?.results.slice(1).slice(offset*index, offset*index+offset).map(movie => <Box bgPhoto={makeImagePath(movie.backdrop_path || "","w500")} key={movie.id+""} >{movie.title}</Box>)}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>
            )}
        </Wrapper>
    );
}