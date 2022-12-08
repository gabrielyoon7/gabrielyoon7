import { Chip, Grid, Typography } from "@mui/material";
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
                    <Grid item xs={12} lg={6} xl={4} key={e.title}>
                        <ResponsiveCard>
                            <Chip label={e.time} />
                            <Typography variant="overline">
                                {e.team}
                            </Typography>                            
                            <Typography variant="subtitle1">
                                {e.award}
                            </Typography>
                            <Typography variant="h5" noWrap>
                                {e.title}
                            </Typography>
                            <Typography variant="inherit">
                                {e.description}
                            </Typography>
                        </ResponsiveCard>
                    </Grid>
                )}

            </Grid>
        </>
    );
};

export default Etc;