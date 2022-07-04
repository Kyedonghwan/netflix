import { useState } from "react";
import { useQuery } from "react-query";
import { ITvOnTheAir, getTv } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";

export default function TV () {
    
    const { data, isLoading } = useQuery<ITvOnTheAir>(["tv", "ontheair"], getTv);

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
        padding: 80px;
    `

    const Wrapper = styled.div<{ backgroundPoster: string }>`
        background-image: linear-gradient( to bottom, transparent, black), url("${props=> props.backgroundPoster}");
        background-size: cover;
        height: 100vh;
    `

    const Posters = styled.div`
        
    `

    return <Background>
    { isLoading ? null : (
        <Wrapper backgroundPoster={makeImagePath(data?.results[0].backdrop_path || "")}>
            <TitleBox>
                <Title>{data?.results[0].name}</Title>
                <Overview>{data?.results[0].overview}</Overview>
            </TitleBox>
            <Posters>

            </Posters>
        </Wrapper>
    )}
    </Background>
}