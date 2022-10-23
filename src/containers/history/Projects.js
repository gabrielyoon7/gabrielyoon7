import ProjectCard from "../../components/projects/ProjectCard"
import projects from "../../assets/data/project/projects"
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import tech from "../../assets/data/tech"
import ModalStaticBackdrop from "components/common/home/ModalStaticBackdrop"
import ProjectViewModal from "components/projects/ProjectViewModal"

export default () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectModalOpen, setProjectModalOpen] = useState(false);

    const handleData = (data) => {
        setSelectedProject(data);
        setProjectModalOpen(true);
    }

    return (
        <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 align-items-stretch mb-5">
                {
                    projects.map((project) => <ProjectCard
                        key={project.key}
                        project={project}
                        handleData={handleData}
                    />)
                }
            </div>
            <ModalStaticBackdrop
                keepMounted
                width="lg"
                open={projectModalOpen}
                component={<ProjectViewModal
                    open={setProjectModalOpen}
                    project={selectedProject}
                />}
            />
        </>
    )
}