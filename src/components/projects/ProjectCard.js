import { Box, Card, CardActionArea } from "@mui/material"
import tech from "../../assets/data/tech"

export default (props) => {
    const findTech = (t) => {
        const idx = tech.findIndex((tech) => tech.value === t)
        return tech[idx]
    }
    return (
        <div className="col">
            <Card onClick={() => props.handleData(props.project)}>
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
                    // width:"100%"
                }}
            >
                <h6>{props.project.period_start} - {props.project.period_end}</h6>
                        <h4>{props.project.team}</h4>
                        <h3>{props.project.title}</h3>
                        <p>{props.project.short_description}</p>
                        <div>
                            {props.project.tech_stack.map((t) => <span key={findTech(t).value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                        </div>
                </Box>
                </CardActionArea>
            </Card>
        </div>
    )
}