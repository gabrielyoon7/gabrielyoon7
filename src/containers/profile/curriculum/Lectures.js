import { Box, Typography } from "@mui/material"
import Table from "../../../components/Table";
import curriculum from "../../../assets/data/curriculum";

export default () => {
    return (
        <>
            <Typography variant="h4">
                수강 강좌
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    overflowX: "scroll"
                }}
            >
                <Box sx={{minWidth:'800px'}}>
                    <Table data={curriculum} rowsPerPage={10} />
                </Box>
            </Box>
        </>
    )
}