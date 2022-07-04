import { useState } from "react";
import { useQuery } from "react-query";
import { ITvOnTheAir, getTv } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { isThrowStatement } from "typescript";
import { useMatch, useNavigate } from "react-router-dom";

const Background = styled.div`
    background-color: black;
    height: 200vh;
`

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`

const Overview = styled.p`
    font-size: 36px;
    width: 50%;
`

const TitleBox = styled.div`
    padding: 20px 80px;
`

const Wrapper = styled.div`
    
`

const Banner = styled.div<{ backgroundPoster: string }>`
    background-image: linear-gradient( to bottom, transparent, black), url("${props=> props.backgroundPoster}");
    background-size: cover;
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Posters = styled(motion.ul)`
    display: flex;
    position: absolute;
    bottom: 50px;
    width: 100%;
`

const Poster = styled.li`
    flex: 1;
    padding: 10px;
`

const PosterDetail = styled(motion.div)<{bgImage: string}>`
    background-image: url("${props => props.bgImage}");
    height: 200px;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
`

const posterVariant = {
    invisual : {
        x: window.outerWidth
    },
    visual: {
        x: 0
    },
    exit: {
        x: -window.outerWidth
    }
}

const posterDetailVariant = {
    hover : {
        y: -15,
        scale: 1.3,
        transition: {
            type: "tween",
            duration: 0.3,
            delay: 0.5
        }
    },
    
}

const Overlay= styled(motion.div)`
    position: fixed;
    background-color: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
}
`

const TvMatch = styled(motion.div)`
    width: 500px;
    height: 500px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 300px;
    background-color: ${props => props.theme.black.darker};
`

export default function TV () {
    
    const { data, isLoading } = useQuery<ITvOnTheAir>(["tv", "ontheair"], getTv);

    const [ page, setPage ] = useState(0);

    const history = useNavigate();

    const tvMatch = useMatch("/tv/:tvId");

    const tvData = tvMatch?.params.tvId && data?.results.find(item => item.id+""===tvMatch.params.tvId);

    const upIndex = () => {
        if(leaving) {
            return ;
        }else{
            setLeaving(true);
            setPage(prev => prev+1);
        }
    }

    const posterDetailClick = ( tvId: string ) => {
        history(`/tv/${tvId}`);
    }

    const total = data?.results.slice(1) || [];

    const [ leaving, setLeaving ] = useState(false);

    return <Background>
    { isLoading ? null : (
        <Wrapper>
            
            <Banner  onClick={upIndex} backgroundPoster={makeImagePath(data?.results[0].backdrop_path || "")}>
                <TitleBox>
                    <Title>{data?.results[0].name}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </TitleBox>
            </Banner>
            <AnimatePresence initial={false} onExitComplete={() => setLeaving(prev=> !prev)}>
                <Posters key={page} variants={posterVariant} initial="invisual" animate="visual" exit="exit" transition={ { type: "tween", duration: 1 } }>
                    { data ? [ 1, 2, 3, 4, 5, 6 ].map((item, index) => {
                        
                        const totalLength = total.length;

                        if(page===Math.floor(totalLength/6)){
                            setPage(0);
                            return;
                        }
                        
                        return <Poster key={index}><PosterDetail onClick={() => {posterDetailClick(total[page*6+item].id+"")}} variants={posterDetailVariant} layoutId={total[page*6+item].id +""}  whileHover="hover" bgImage={makeImagePath(total[page*6+item].backdrop_path, "w500")}/></Poster>;
                    }) : null }
                </Posters>
            </AnimatePresence>
            <AnimatePresence>
                {tvMatch? <Overlay animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} onClick={()=> history("/tv")}>
                    <TvMatch layoutId={tvData && tvData.id +""} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>{tvData && tvData.name}</TvMatch>
                </Overlay>: null}
            </AnimatePresence>
        </Wrapper>
    )}
    </Background>
}