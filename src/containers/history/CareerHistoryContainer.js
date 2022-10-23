import { Grid, Typography } from "@mui/material"
import HomeCard from "components/common/home/HomeCard"
import Projects from "./Projects"

export default () => {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        Projects
                    </Typography>
                    <Projects />
                </Grid>
                {/* <Grid item xs={12}>
                    <Typography variant="h3">
                        Timeline
                    </Typography>
                    <HomeCard
                        children={<>
                            ㅇㅇ
                        </>}
                    />
                </Grid> */}
            </Grid>
        </>
    )
}