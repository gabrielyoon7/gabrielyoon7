import ProjectCard from "../../components/projects/ProjectCard"
import projects from "../../assets/data/project/projects"
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import tech from "../../assets/data/tech"
import ModalStaticBackdrop from "components/common/home/ModalStaticBackdrop"
import ProjectViewModal from "components/projects/ProjectViewModal"
import { Grid } from "@mui/material"

export default () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectModalOpen, setProjectModalOpen] = useState(false);

    const handleData = (data) => {
        setSelectedProject(data);
        setProjectModalOpen(true);
    }

    return (
        <>
            <Grid
                container
                spacing={1}
                alignItems="stretch"
            >
                {
                    projects.map((project) => <ProjectCard
                        key={project.key}
                        project={project}
                        handleData={handleData}
                    />)
                }
            </Grid>
            <ModalStaticBackdrop
                keepMounted
                width="lg"
                open={projectModalOpen}
                component={
                    <ProjectViewModal
                        open={setProjectModalOpen}
                        project={selectedProject}
                    />
                }
            />
        </>
    )
}