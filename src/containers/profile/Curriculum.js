import Table from "../../components/Table";
import curriculum from "../../assets/data/curriculum";
import Score from "./Score";
import { Grid, Typography } from "@mui/material";

export default () => {

    return (
        <>
            <Typography variant="h3">
                Curriculum
            </Typography>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Table data={curriculum} rowsPerPage={10} />
                </Grid>
                <Grid item xs={12}>
                    <Score />
                </Grid>
            </Grid>
        </>
    )
}

