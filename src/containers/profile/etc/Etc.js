import { Grid, Typography } from "@mui/material"
import etc from "assets/data/etc"
import ResponsiveCard from "components/common/home/ResponsiveCard"

export default () => {
    return (
        <>
            <Grid
                container
                spacing={1}
                alignItems="stretch"
            >
                {etc.map((e) =>
                    <Grid item xs={12} lg={6} xl={4}>
                        <ResponsiveCard>
                            <Typography variant="caption">
                                {e.time}
                            </Typography>
                            <Typography variant="h5">
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
    )
}