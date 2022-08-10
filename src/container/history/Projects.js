import ProjectCard from "../../component/projects/ProjectCard"
import projects from "../../assets/data/project/projects"
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default () => {
    const [selected, setSelected] = useState(null);

    const handleData = (data) => {
        setSelected(data);
    }

    return (
        <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 align-items-stretch mb-5">
                {projects.map((project) => <ProjectCard key={project.key} project={project} setSelected={setSelected} handleData={handleData} />)}
            </div>
            <div className="modal fade" id="project-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {/* 기사 보여주는 모달 */}
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content super-rounded shadow">
                        {
                            selected &&
                            <>
                                <div className="modal-header border-bottom-0">
                                    <h5 className="modal-title">프로젝트</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body py-0">
                                    <ReactMarkdown children={require('../../assets/data/project/description/project'+selected.key).default} remarkPlugins={[remarkGfm]} />
                                </div>
                                <div className="modal-footer border-top-0 d-flex justify-content-between">
                                    <button type="button" className="col btn btn-lg btn-outline-danger w-100 mx-1" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="col btn btn-lg btn-outline-success w-100 mx-1" data-bs-dismiss="modal">Bookmark</button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}