import Table from "../../components/Table";
import curriculum from "../../assets/data/curriculum";
import Score from "./Score";
import { Box, Grid, Typography } from "@mui/material";

export default () => {

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        수강 강좌
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            overflowX: "auto"
                        }}
                    >
                        <Table data={curriculum} rowsPerPage={10} />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Score />
                </Grid>
            </Grid>
        </>
    )
}

