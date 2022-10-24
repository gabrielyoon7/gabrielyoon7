import { Box, DialogContent, DialogTitle, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import MKButton from "components/common/mui-components/MKButton"
import ClearIcon from '@mui/icons-material/Clear';
import tech from "assets/data/tech";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
export default ({ open, tech }) => {
    const findTech = (t) => {
        const idx = tech.findIndex((tech) => tech.value === t)
        return tech[idx]
    }
    return (
        <>
            {
                tech &&
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
                                Tech Stack
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
                            <Typography>{JSON.stringify(tech)}</Typography>
                        </Stack>
                    </DialogContent>
                    <MKButton color="success" fullWidth onClick={() => open(false)}>확인</MKButton>
                </Box>
            }
        </>
    )
}