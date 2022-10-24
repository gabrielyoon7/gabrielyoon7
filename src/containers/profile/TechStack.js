import { Grid, Typography } from "@mui/material"
import HomeCard from "components/common/home/HomeCard"
import ModalStaticBackdrop from "components/common/home/ModalStaticBackdrop"
import TechStackModal from "components/profile/TechStackModal"
import { useState } from "react"
import tech from "../../assets/data/tech"

export default () => {
    const findTech = (t) => {
        const idx = tech.findIndex((tech) => tech.value === t.value)
        return tech[idx]
    }
    // console.log(tech)

    const [techStackModalOpen, setTechStackModalOpen] = useState(false);
    const [selectedTechType, setSelectedTechType] = useState([]);

    const handleCard = (type) => {
        setTechStackModalOpen(true);
        setSelectedTechType(tech.filter((t) => t.type === type))
    }

    return (
        <>
            <Typography variant="h3" my={2}>Tech Stack</Typography>
            <Grid container spacing={1} alignItems="stretch">
                <Grid item xs={12} xl={4}>
                    <HomeCard actionArea onClick={()=>handleCard('fe')}>
                        <Typography variant="h5">
                            Front-End
                        </Typography>
                        {tech.filter((t) => t.type === 'fe').map((t) => <span key={t.value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}

                    </HomeCard>
                </Grid>
                <Grid item xs={12} xl={4}>
                    <HomeCard actionArea onClick={()=>handleCard('be')}>
                        <Typography variant="h5">
                            Back-End
                        </Typography>
                        {tech.filter((t) => t.type === 'be').map((t) => <span key={t.value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}

                    </HomeCard>
                </Grid>
                <Grid item xs={12} xl={4}>
                    <HomeCard actionArea onClick={()=>handleCard('db')}>
                        <Typography variant="h5">
                            DBMS
                        </Typography>
                        {tech.filter((t) => t.type === 'db').map((t) => <span key={t.value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                    </HomeCard>
                </Grid>
                <Grid item xs={12}>
                    <HomeCard actionArea onClick={()=>handleCard('etc')}>
                        <Typography variant="h5">
                            Others
                        </Typography>
                        {tech.filter((t) => t.type === 'etc').map((t) => <span key={t.value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                    </HomeCard>
                </Grid>
            </Grid>
            <ModalStaticBackdrop
                keepMounted
                width="lg"
                open={techStackModalOpen}
                component={
                    <TechStackModal
                        open={setTechStackModalOpen}
                        tech={selectedTechType}
                    />
                }
            />
        </>
    )
}