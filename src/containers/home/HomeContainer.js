
import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import HomeCard from 'components/common/home/HomeCard';
import MKButton from 'components/common/mui-components/MKButton';
import Grid from '@mui/material/Unstable_Grid2';

const HomeContainer = () => {

    return (
        <>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <HomeCard
                        children={
                            <>
                                <Typography variant='h1'>
                                    안녕하세요
                                </Typography>
                                <Typography my={3}>
                                    신입 웹 개발자를 희망하는 윤주현입니다.
                                </Typography>
                                <MKButton
                                    variant='outlined'
                                    color='dark'
                                    onClick={() => window.open('https://github.com/gabrielyoon7')}
                                >
                                    Github에서 보기
                                </MKButton>
                            </>
                        }
                    />
                </Grid>
                <Grid xs={12} lg={6}>
                    <HomeCard
                        to='/profile'
                        children={
                            <>
                                <Typography variant='h2'>
                                    About Me
                                </Typography>
                                <Typography my={3}>
                                    저에 대해 소개합니다.
                                </Typography>
                                <MKButton
                                    variant='outlined'
                                    color='dark'
                                >
                                    확인하기
                                </MKButton>
                            </>
                        }
                    />
                </Grid>
                <Grid xs={12} lg={6}>
                    <HomeCard
                        to='/career'
                        children={
                            <>
                                <Typography variant='h2'>
                                    Career History
                                </Typography>
                                <Typography my={3}>
                                    개발자가 되기 위해 걸어온 길
                                </Typography>
                                <MKButton
                                    variant='outlined'
                                    color='dark'
                                >
                                    확인하기
                                </MKButton>
                            </>
                        }
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default HomeContainer;