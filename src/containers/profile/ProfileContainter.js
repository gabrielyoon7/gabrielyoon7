import "./profile.css";
import me from '../../assets/img/me.jpg'
import Curriculum from "./Curriculum";
import TechStack from "./TechStack";
import HomeCard from "components/common/home/HomeCard";
import { Box, Grid, Stack, Typography } from "@mui/material";
import MKButton from "components/common/mui-components/MKButton";

export default () => {


    return (
        <>
            <Grid
                container
                spacing={1}
                // sx={{alignItems: 'stretch',}}
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
                                        <MKButton
                                            variant="outlined"
                                            color="dark"
                                            onClick={() => window.open('https://github.com/gabrielyoon7')}
                                        >
                                            Github
                                        </MKButton>
                                        <MKButton
                                            variant="outlined"
                                            color="info"
                                            onClick={() => window.open('https://leirbag.tistory.com/')}
                                        >
                                            Tistory
                                        </MKButton>
                                        <MKButton
                                            variant="outlined"
                                            color="error"
                                            onClick={() => window.open('https://www.instagram.com/gabriel._.yn/')}
                                        >
                                            Instagram
                                        </MKButton>
                                    </Stack>
                                </Box>
                            </>
                        }
                    />
                </Grid>
                <Grid item xs={12} xl={8} alignItems="center">
                    <HomeCard
                        children={
                            <>
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
                                            <tr>
                                                <td>약력</td>
                                                <td>
                                                    <ul>
                                                        <li>경기대학교 SW기초 튜터 (2020.9 ~ 2021.12)</li>
                                                        <li>경기대 컴퓨터공학부 홈페이지 개발팀 팀장 (2020.10 ~ 2021.12)</li>
                                                        <li>경기대학교 분산병렬컴퓨팅연구실 (2021.7 ~ )</li>
                                                        <li>경기대학교 SW상상기업 아보카도 팀장 (2021.10 ~ 2022.10)</li>
                                                    </ul>
                                                </td>
                                            </tr>
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
                                        </tbody>
                                    </table>
                                </Box>
                            </>
                        }
                    />

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
                    <HomeCard
                        children={
                            <>
                                <Curriculum />
                            </>
                        }
                    />
                </Grid>
            </Grid>
        </>
    )
}

