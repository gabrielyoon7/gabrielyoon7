export default (props) => {
    return (
        <div className="col">
            <a href="#" className="text-decoration-none text-dark" data-bs-toggle="modal" data-bs-target="#project-modal" onClick={()=>props.setSelected(props.project)}>
                <div className="card p-3 rounded-4">
                    <div className="row">
                        <div className="col py-3">
                            <h4>{props.project.period_start}</h4>
                            <h5>{props.project.team}</h5>
                            <div>{props.project.title}</div>
                            <p>{props.project.short_description}</p>
                            <div>
                                테크스택
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}