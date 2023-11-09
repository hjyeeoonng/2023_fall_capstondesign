import styled from "styled-components";
import React from 'react';
import logoImg from '../img/임시로고.png'
import { useNavigate } from "react-router-dom";

const HeaderRoot = styled.div`
width:100vw;
height:8.88vh;
background-color:#D0B89E;

display:flex;
align-items:center;
`
const HeadButtonSet = styled.div`
width:12%;
display:flex;
align-items:center;
justify-content:space-between;
`
const HeadButtonSet2 = styled.div`
width:20%;
display:flex;
align-items:center;
justify-content:space-between;
`
const HeadButtonText = styled.div`
color: var(--Point-6, #54493F);
font-family: Noto Sans KR;
font-size: 1vw;
font-style: normal;
font-weight: 700;
line-height: normal;
`
const HeadButtonLine = styled.div`
margin: 0% 0.833%;

width: 1px;
height: 21px;
background: #54493F;
`
const HeadImg = styled.img`
height:80%;
`

export const Header = () => {
    const navigate = useNavigate();

    const OnClickHandler = () => {
        navigate("/HelperMy");
    };

    const OnClickHandler2 = () => {
        navigate("/");
    };

    return(
        <>
            <HeaderRoot>
                <div style={{width:"2%"}}></div>
                <HeadImg src={logoImg} onClick={OnClickHandler2}></HeadImg>
                <div style={{width:"2%"}}></div>
                <HeadButtonSet>
                    <HeadButtonText>메뉴A</HeadButtonText>
                    <HeadButtonLine></HeadButtonLine>
                    <HeadButtonText>메뉴B</HeadButtonText>
                    <HeadButtonLine></HeadButtonLine>
                    <HeadButtonText>메뉴C</HeadButtonText>
                </HeadButtonSet>
                <div style={{width:"55%"}}></div>
                <HeadButtonSet2>
                    <HeadButtonText>김헬퍼 도우미님</HeadButtonText>
                    <HeadButtonLine></HeadButtonLine>
                    <HeadButtonText onClick={OnClickHandler}>마이페이지</HeadButtonText>
                    <HeadButtonLine></HeadButtonLine>
                    <HeadButtonText>로그아웃</HeadButtonText>
                </HeadButtonSet2>
            </HeaderRoot>
        </>
    );
};
export default Header;