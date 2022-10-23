import { Grid, Typography } from "@mui/material"
import HomeCard from "components/common/home/HomeCard"
import tech from "../../assets/data/tech"

export default () => {
    const findTech = (t) => {
        const idx = tech.findIndex((tech) => tech.value === t.value)
        return tech[idx]
    }
    // console.log(tech)

    return (
        <>
            <Typography variant="h3">Tech Stack</Typography>
            <Grid container spacing={1}>
                <Grid item xs={12} xl={4}>
                    <HomeCard
                        actionArea
                        children={
                            <>
                                <Typography variant="h5">
                                    Front-End
                                </Typography>
                                {tech.filter((t) => t.type === 'fe').map((t) => <span key={t.value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                            </>
                        }
                    />
                </Grid>
                <Grid item xs={12} xl={4}>
                    <HomeCard
                        actionArea
                        children={
                            <>
                                <Typography variant="h5">
                                    Back-End
                                </Typography>
                                {tech.filter((t) => t.type === 'be').map((t) => <span key={t.value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                            </>
                        }
                    />
                </Grid>
                <Grid item xs={12} xl={4}>
                    <HomeCard
                        actionArea
                        children={
                            <>
                                <Typography variant="h5">
                                    DBMS
                                </Typography>
                                {tech.filter((t) => t.type === 'db').map((t) => <span key={t.value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                            </>
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <HomeCard
                        actionArea
                        children={
                            <>
                                <Typography variant="h5">
                                    Others
                                </Typography>
                                {tech.filter((t) => t.type === 'etc').map((t) => <span key={t.value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                            </>
                        }
                    />
                </Grid>
            </Grid>
        </>
    )
}