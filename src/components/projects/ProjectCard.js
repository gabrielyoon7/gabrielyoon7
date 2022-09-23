import tech from "../../assets/data/tech"

export default (props) => {
    const findTech = (t) => {
        const idx = tech.findIndex((tech) => tech.value === t)
        return tech[idx]
    }
    return (
        <div className="col">
            <a href="#" className="text-decoration-none text-dark" data-bs-toggle="modal" data-bs-target="#project-modal" onClick={() => props.handleData(props.project)}>
                <div className="card p-3 rounded-4">
                    <div className="row">
                        <div className="col py-3">
                            <h6>{props.project.period_start} - {props.project.period_end}</h6>
                            <h4>{props.project.team}</h4>
                            <h3>{props.project.title}</h3>
                            <p>{props.project.short_description}</p>
                            <div>
                                {props.project.tech_stack.map((t) => <span key={findTech(t).value} className="badge me-1" style={{ "backgroundColor": findTech(t).bgColor, "color": findTech(t).txtColor }}>{findTech(t).label}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}