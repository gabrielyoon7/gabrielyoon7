import { Box, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from "@mui/material"
import MKButton from "components/common/mui-components/MKButton"
import ClearIcon from '@mui/icons-material/Clear';
import tech from "assets/data/tech";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
export default ({ open, project }) => {
    const findTech = (t) => {
        const idx = tech.findIndex((tech) => tech.value === t)
        return tech[idx]
    }
    return (
        <>
            {
                project &&
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
                            <Typography variant="h5">
                                기간
                            </Typography>
                            <Typography>
                                {project.period_start} ~ {project.period_end}
                            </Typography>
                            <Typography variant="h5">
                                그룹명
                            </Typography>
                            <Typography>
                                {project.team}
                            </Typography>
                            <Typography variant="h5">
                                프로젝트명
                            </Typography>
                            <Typography>
                                {project.title}
                            </Typography>
                            <Typography variant="h5">
                                요약
                            </Typography>
                            <Typography>
                                {project.short_description}
                            </Typography>
                            <Typography variant="h5">
                                URL
                            </Typography>
                            <Typography>
                                {project.url}
                            </Typography>
                            <Typography variant="h5">
                                Github Repository
                            </Typography>
                            <Typography>
                                {project.repository}
                            </Typography>
                            <Divider/>
                            <Typography>
                                <ReactMarkdown children={require('../../assets/data/project/description/project' + project.key).default} remarkPlugins={[remarkGfm]} />
                            </Typography>
                            <Divider/>
                            <Typography variant="h5">
                                Tech Stack
                            </Typography>
                            <Typography>
                                {project.tech_stack.map((t) => <span key={findTech(t).value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                            </Typography>
                        </Stack>
                    </DialogContent>
                    <MKButton color="success" fullWidth>ㅇㅇ</MKButton>
                </Box>
            }
        </>
    )
}