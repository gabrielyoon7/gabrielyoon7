import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material"
import tech from "../../assets/data/tech"

export default (props) => {
    const findTech = (t) => {
        const idx = tech.findIndex((tech) => tech.value === t)
        return tech[idx]
    }
    const project = props.project;
    return (
        <Card
            sx={{ height: '100%', width: '100%' }}
            onClick={() => props.handleData(project)}
        >
            <CardActionArea>
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
                    <Typography variant="caption">{project.period_start} - {project.period_end}</Typography>
                    <Typography variant="h6">{project.team}</Typography>
                    <Typography variant="h4">{project.title}</Typography>

                    <Typography variant="subtitle2">{project.short_description}</Typography>
                    <div>
                        {project.tech_stack.slice(0, 3).map(
                            (t) =>
                                <span
                                    key={findTech(t).value}
                                    className="badge me-1"
                                    style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>
                                    {findTech(t).label}
                                </span>
                        )}
                        <span
                            key={"..."}
                            className="badge me-1"
                            style={{ "backgroundColor": '#eae3e3', "color": "gray" }}>
                            ... more
                        </span>
                    </div>
                </Box>
            </CardActionArea>
        </Card>
    )
}