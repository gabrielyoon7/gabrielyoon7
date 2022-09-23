import Projects from "./Projects"

export default () => {
    return (
        <>
            <div className="row">
                <div className="col-12 my-2">
                    <div className="card p-5 mb-4 rounded-4 border-primary border bg-white">
                        <h3>Projects</h3>
                        <Projects/>
                    </div>
                </div>
                <div className="col-12 my-2">
                    <div className="card p-5 mb-4 rounded-4 border-primary border bg-white">
                        <h3>Timeline</h3>
                    </div>
                </div>
            </div>
        </>
    )
}