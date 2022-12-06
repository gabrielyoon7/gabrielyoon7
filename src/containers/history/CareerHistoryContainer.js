import { Grid, Typography } from "@mui/material";
import Projects from "./Projects";

const CareerHistoryContainer = () => {
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
    );
};

export default CareerHistoryContainer;