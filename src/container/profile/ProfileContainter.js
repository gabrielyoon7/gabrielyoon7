import "./profile.css";

export default () => {
    return (
        <>
            <div className="row">
                <div className="col-md-4 my-1">
                    <div className="card">
                        <div className="d-flex flex-column align-items-center text-center py-5">
                            <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>

                            <h2 className="fw-normal">윤주현</h2>
                            <p>ㅇㅇ</p>
                            <p><a className="btn btn-secondary" href="#">View details &raquo;</a><a className="btn btn-secondary" href="#">View details &raquo;</a></p>

                        </div>
                    </div>
                </div>
                <div className="col-md-8 my-1">
                    <div className="card">
                        <h3>개인정보</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

