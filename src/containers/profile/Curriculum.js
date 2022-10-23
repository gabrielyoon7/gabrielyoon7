import Table from "../../components/Table";
import curriculum from "../../assets/data/curriculum";
import Score from "./Score";
import { Grid, Typography } from "@mui/material";

export default () => {

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        수강 강좌
                    </Typography>
                    <Table data={curriculum} rowsPerPage={10} />
                </Grid>
                <Grid item xs={12}>
                    <Score />
                </Grid>
            </Grid>
        </>
    )
}

