import ProjectCard from "../../component/projects/ProjectCard"
import projects from "../../assets/data/projects"

export default () => {
    return (
        <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 align-items-stretch mb-5">
                {projects.map((project)=><ProjectCard key={project.key} project={project}/>)}
            </div>
            <div className="modal fade" id="project-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {/* 기사 보여주는 모달 */}
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content super-rounded shadow">
                        ㅇㅇ
                    </div>
                </div>
            </div>
        </>
    )
}