import "./profile.css";
import me from '../../assets/img/me.jpg'
import Curriculum from "./Curriculum";
import TechStack from "./TechStack";
import HomeCard from "components/common/home/HomeCard";
import { Box, Grid, Stack, Tooltip, Typography } from "@mui/material";
import MKButton from "components/common/mui-components/MKButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ResponsiveCard from "components/common/home/ResponsiveCard";
import LifeTimeline from "./timeline/LifeTimeline";

export default () => {


    return (
        <>
            <Grid
                container
                spacing={1}
                alignItems="stretch"
            >
                <Grid item xs={12}>
                    <Typography variant="h3">기본정보</Typography>
                </Grid>
                <Grid item xs={12} xl={4}>
                    <HomeCard
                        children={
                            <>
                                <Box align="center">

                                    <img className="img-fluid rounded-4 mb-3" src={me} width={140}></img>
                                    <Typography variant="h3">윤주현</Typography>
                                    <Typography>계속 전진하겠습니다.</Typography>
                                    <Stack direction={"row"} spacing={1} sx={{ justifyContent: "center" }}>
                                        <Tooltip title='새 창에서 열기'>
                                            <MKButton
                                                variant="outlined"
                                                color="dark"
                                                onClick={() => window.open('https://github.com/gabrielyoon7')}
                                            >
                                                <GitHubIcon /> Github
                                            </MKButton>
                                        </Tooltip>
                                        <Tooltip title='새 창에서 열기'>
                                            <MKButton
                                                variant="outlined"
                                                color="info"
                                                onClick={() => window.open('https://leirbag.tistory.com/')}
                                            >
                                                <RssFeedIcon />Tistory
                                            </MKButton>
                                        </Tooltip>
                                        <Tooltip title='새 창에서 열기'>
                                            <MKButton
                                                variant="outlined"
                                                color="error"
                                                onClick={() => window.open('https://www.instagram.com/gabriel._.yn/')}
                                            >
                                                <InstagramIcon /> Instagram
                                            </MKButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            </>
                        }
                    />
                </Grid>
                <Grid item xs={12} xl={8} alignItems="center">
                    <ResponsiveCard>
                        <Box>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th colSpan="2">
                                            <Typography variant="h4"></Typography>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>생년월일</td>
                                        <td>1996. 03. 25</td>
                                    </tr>
                                    <tr>
                                        <td>학력</td>
                                        <td>경기대학교 컴퓨터공학부 (2017.3 ~ 2023.2)</td>
                                    </tr>
                                    <tr>
                                        <td>주소</td>
                                        <td><span>경기도 하남시 </span><span>미사강변호반써밋아파트</span></td>
                                    </tr>
                                    {/* <tr>
                                                <td>약력</td>
                                                <td>
                                                    <ul>

                                                    </ul>
                                                </td>
                                            </tr> */}
                                    <tr>
                                        <td>관심포지션</td>
                                        <td>
                                            프론트엔드(1순위), 백엔드(2순위)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>관심분야</td>
                                        <td>
                                            웹개발, 앱개발
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>MBTI</td>
                                        <td>
                                            ESTP
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Box>
                    </ResponsiveCard>

                </Grid>
                <Grid item xs={12}>
                    <TechStack />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        Curriculum
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ResponsiveCard>
                        <Curriculum />
                    </ResponsiveCard>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        걸어온 길
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ResponsiveCard>
                        <LifeTimeline/>
                        {/* <Typography>• 2021-1 경기대학교 BARUN 문제해결 프로젝트 (세.나.페 팀) 우수상 (학과 홈페이지 사물함 신청 서비스) (`21.06`)</Typography>
                        <Typography>• 2021 경기대학교 진성애교양대학 감성SW교육센터 공로상 (2021.12)</Typography>
                        <Typography>• 2021-2 경기대학교 BARUN 문제해결 프로젝트 (세.나.페 팀) 장려상 (학과 홈페이지 졸업 요건 분석 서비스) (2021.12)</Typography>
                        <Typography>• 2022년 1회 정보처리기사 (2022.06)</Typography>
                        <Typography>• 2022 하계 한국정보기술학회 대학생논문경진대회 은상 : 개인 맞춤형 질병 유추 챗봇 애플리케이션 설계 및 구현 (2022.06)</Typography>
                        <Typography>• 2022-1 경기대학교 BARUN 문제해결 프로젝트 (닥터스트레인지 팀) 은상 (개인 맞춤형 질병 정보 제공 및 유추 시스템 개발) (2022.06)</Typography> */}
                    </ResponsiveCard>
                </Grid>
            </Grid>
        </>
    )
}

