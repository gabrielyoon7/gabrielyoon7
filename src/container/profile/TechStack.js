export default () => {
    const tech = [
        { type: "fe", name: "React", color: "primary" },
        { type: "fe", name: "JavaScript", color: "warning" },
        { type: "fe", name: "CSS", color: "info" },
        { type: "fe", name: "HTML", color: "danger" },
        { type: "fe", name: "Expo", color: "dark" },
        { type: "fe", name: "React Native", color: "primary" },
        { type: "fe", name: "Native Base", color: "info" },
        { type: "be", name: "Java", color: "danger" },
        { type: "be", name: "JSP", color: "dark" },
        { type: "fe", name: "jQuery", color: "secondary" },
        { type: "db", name: "MongoDB", color: "success" },
        { type: "be", name: "Node.js", color: "success" },
        { type: "be", name: "express.js", color: "light" },
        { type: "be", name: "Python", color: "primary" },
        { type: "db", name: "MySQL", color: "primary" },
        { type: "db", name: "MariaDB", color: "info" },
        { type: "fe", name: "bootstrap", color: "light" },
        { type: "etc", name: "Ubuntu", color: "danger" },
        { type: "etc", name: "Tomcat", color: "warning" },
    ]
    return (
        <>
            <h3>Tech Stack</h3>
            <div className="row">
                <div className="col-md-4 my-1">
                    <h5>Front-End</h5>
                    {tech.filter((t) => t.type === 'fe').map((t) => <span key={t.name} className={"me-1 badge text-bg-" + t.color}>{t.name}</span>)}
                </div>
                <div className="col-md-4 my-1">
                    <h5>Back-End</h5>
                    {tech.filter((t) => t.type === 'be').map((t) => <span key={t.name} className={"me-1 badge text-bg-" + t.color}>{t.name}</span>)}
                </div>
                <div className="col-md-4 my-1">
                    <h5>DBMS</h5>
                    {tech.filter((t) => t.type === 'db').map((t) => <span key={t.name} className={"me-1 badge text-bg-" + t.color}>{t.name}</span>)}
                </div>
                <div className="col">
                    <h5>Others</h5>
                    {tech.filter((t) => t.type === 'etc').map((t) => <span key={t.name} className={"me-1 badge text-bg-" + t.color}>{t.name}</span>)}
                </div>
            </div>
        </>
    )
}