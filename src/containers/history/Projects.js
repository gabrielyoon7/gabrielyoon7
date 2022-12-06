import ProjectCard from "../../components/projects/ProjectCard";
import projects from "../../assets/data/project/projects";
import React, { useState } from 'react';
import ModalStaticBackdrop from "components/common/home/ModalStaticBackdrop";
import ProjectViewModal from "components/projects/ProjectViewModal";
import { Grid } from "@mui/material";

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectModalOpen, setProjectModalOpen] = useState(false);

    const handleData = (data) => {
        setSelectedProject(data);
        setProjectModalOpen(true);
    };

    return (
        <>
            <Grid
                container
                spacing={1}
                alignItems="stretch"
            >
                {
                    projects.map((project) =>
                        <Grid item xs={12} lg={6} xxl={4} key={project.key}>
                            <ProjectCard                                
                                project={project}
                                handleData={handleData}
                            />
                        </Grid>
                    )
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
    );
};


export default Projects;