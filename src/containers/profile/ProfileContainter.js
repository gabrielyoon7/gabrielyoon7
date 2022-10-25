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
import Etc from "./etc/Etc";

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
                    </ResponsiveCard>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        수상이력 및 자격증
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Etc/>
                </Grid>
            </Grid>
        </>
    )
}

