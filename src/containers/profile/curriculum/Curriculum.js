import { Grid } from "@mui/material";
import Score from "./Score";
import ResponsiveCard from "components/common/home/ResponsiveCard";
import Lectures from "./Lectures";

const Curriculum = () => {

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <ResponsiveCard>
                        <Lectures />
                    </ResponsiveCard>
                </Grid>
                <Score />
            </Grid>
        </>
    );
};

export default Curriculum;
