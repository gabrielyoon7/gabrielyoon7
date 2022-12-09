import { Box, Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import etc from "assets/data/etc";
import ResponsiveCard from "components/common/home/ResponsiveCard";
import MKButton from "components/common/mui-components/MKButton";

const Etc = () => {
    return (
        <>
            <Grid
                container
                spacing={1}
                alignItems="stretch"
            >
                {etc.map((e) =>
                    <Grid item xs={12} lg={6} key={e.title}>
                        <ResponsiveCard>
                            <Stack spacing={1}>
                                <Stack direction={"row"} justifyContent={"space-between"}>
                                    <Box>
                                        <Chip label={e.time} />
                                    </Box>
                                    <Box>
                                        {e.award && <Chip label={e.award} color="secondary" />}
                                    </Box>
                                </Stack>
                                <Typography variant="h5" noWrap>
                                    {e.title}
                                </Typography>
                                <Typography variant="subtitle2" noWrap>
                                    {e.description}
                                </Typography>
                                {e.link && <>
                                    <Stack direction={"row"}>
                                        <Tooltip title='새 창에서 열기'>
                                            <MKButton
                                                variant="outlined"
                                                color="info"
                                                onClick={() => window.open(e.link)}
                                            >
                                                확인하기
                                            </MKButton>
                                        </Tooltip>
                                    </Stack>
                                </>}
                            </Stack>
                        </ResponsiveCard>
                    </Grid>
                )}

            </Grid>
        </>
    );
};

export default Etc;