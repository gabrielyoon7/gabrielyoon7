export default () => {
    return (
        <div className="col">
            <a href="#" className="text-decoration-none text-dark" data-bs-toggle="modal" data-bs-target="#project-modal" >
                <div className="card p-3 rounded-4">
                    <div className="row">
                        <div className="text-center col-xxl-4 py-4">
                            <svg className="img-thumbnail rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                            <div>??</div>
                        </div>
                        <div className="col-xxl-8 py-3">
                            <h4>그룹명</h4>
                            <h5>프로젝트명</h5>
                            <p>설명</p>
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