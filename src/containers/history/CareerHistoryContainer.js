import { Box, Grid, Typography } from "@mui/material";
import Projects from "./Projects";

const CareerHistoryContainer = () => {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box mb={2}>
                        <Typography variant="h3">
                            Projects
                        </Typography>
                    </Box>
                    <Projects />
                </Grid>
            </Grid>
        </>
    );
};

export default CareerHistoryContainer;