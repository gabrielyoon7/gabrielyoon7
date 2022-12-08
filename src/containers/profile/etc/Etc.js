import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import etc from "assets/data/etc";
import ResponsiveCard from "components/common/home/ResponsiveCard";

const Etc = () => {
    return (
        <>
            <Grid
                container
                spacing={1}
                alignItems="stretch"
            >
                {etc.map((e) =>
                    <Grid item xs={12} lg={6}  key={e.title}>
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
                            </Stack>
                        </ResponsiveCard>
                    </Grid>
                )}

            </Grid>
        </>
    );
};

export default Etc;