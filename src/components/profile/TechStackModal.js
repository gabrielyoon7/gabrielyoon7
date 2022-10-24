import { Box, DialogContent, DialogTitle, Divider, IconButton, Rating, Stack, Tooltip, Typography } from "@mui/material"
import MKButton from "components/common/mui-components/MKButton"
import ClearIcon from '@mui/icons-material/Clear';
import tech from "assets/data/tech";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
export default ({ open, tech }) => {
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>기술</Box>
                            <Box>선호도</Box>
                        </Box>
                        {tech.map((t) =>
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box><span key={t.value} className="badge me-1" style={{ "backgroundColor": t.bgColor, "color": t.txtColor }}>{t.label}</span></Box>
                                    <Stack direction={"row"} spacing={1}>
                                        <Rating name="half-rating-read" defaultValue={t.stars} precision={0.5} readOnly />
                                        <Box>{t.stars.toFixed(1)}</Box>
                                    </Stack>
                                </Box>
                                <Divider />
                            </>
                        )}
                    </DialogContent>
                    <MKButton color="success" fullWidth onClick={() => open(false)}>확인</MKButton>
                </Box>
            }
        </>
    )
}