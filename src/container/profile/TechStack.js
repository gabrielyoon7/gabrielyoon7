import tech from "../../assets/data/tech"

export default () => {
    const findTech = (t) => {
        const idx = tech.findIndex((tech)=>tech.value===t.value)
        return tech[idx]
    }
    // console.log(tech)

    return (
        <>
            <h3>Tech Stack</h3>
            <div className="row">
                <div className="col-md-4 my-1">
                    <h5>Front-End</h5>
                    {tech.filter((t) => t.type === 'fe').map((t)=><span key={t.value} className="badge me-1" style={{"backgroundColor":findTech(t).bgColor, "color":findTech(t).txtColor}}>{findTech(t).label}</span>)}
                </div>
                <div className="col-md-4 my-1">
                    <h5>Back-End</h5>
                    {tech.filter((t) => t.type === 'be').map((t)=><span key={t.value} className="badge me-1" style={{"backgroundColor":findTech(t).bgColor, "color":findTech(t).txtColor}}>{findTech(t).label}</span>)}
                </div>
                <div className="col-md-4 my-1">
                    <h5>DBMS</h5>
                    {tech.filter((t) => t.type === 'db').map((t)=><span key={t.value} className="badge me-1" style={{"backgroundColor":findTech(t).bgColor, "color":findTech(t).txtColor}}>{findTech(t).label}</span>)}
                </div>
                <div className="col">
                    <h5>Others</h5>
                    {tech.filter((t) => t.type === 'etc').map((t)=><span key={t.value} className="badge me-1" style={{"backgroundColor":findTech(t).bgColor, "color":findTech(t).txtColor}}>{findTech(t).label}</span>)}
                </div>
            </div>
        </>
    )
}