import { Box, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material"
import MKButton from "components/common/mui-components/MKButton"
import ClearIcon from '@mui/icons-material/Clear';
export default ({ open, project }) => {
    return (
        <>
            <Box
                sx={{
                    p: {
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 5,
                        xxl: 6
                    },
                }}
            >
                <DialogTitle id="scroll-dialog-title">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h4" variant="h3">
                            프로젝트
                        </Typography>
                        <IconButton
                            size="large"
                            onClick={() => open(false)}
                        >
                            <ClearIcon fontSize="inherit" />
                        </IconButton >
                    </Box>
                </DialogTitle>
                <DialogContent dividers={true}>
                    <Stack spacing={1}>
                        {JSON.stringify(project)}
                    </Stack>
                </DialogContent>
                <MKButton color="success" fullWidth>ㅇㅇ</MKButton>
            </Box>
        </>
    )
}