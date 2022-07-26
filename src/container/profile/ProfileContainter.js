import "./profile.css";
import me from '../../assets/img/me.jpg'
import Curriculum from "./Curriculum";

export default () => {


    return (
        <>
            <div className="row">
                <div className="col-md-4 my-2 d-flex align-items-stretch">
                    <div className="card w-100">
                        <div className="d-flex flex-column align-items-center text-center py-5">
                            <img className="img-fluid rounded-4 mb-3" src={me} width={140}></img>

                            <h2 className="fw-normal">윤주현</h2>
                            <p>자기소개</p>
                            <p>
                                <a className="btn btn-outline-dark m-1" target="_blank" href="https://github.com/gabrielyoon7">Github</a>
                                <a className="btn btn-outline-primary m-1" target="_blank" href="https://leirbag.tistory.com/">Tistory</a>
                                <a className="btn btn-outline-danger m-1" target="_blank" href="https://www.instagram.com/gabriel._.yn/">Instagram</a>
                            </p>

                        </div>
                    </div>
                </div>
                <div className="col-md-8 my-2 d-flex align-items-stretch">
                    <div className="card p-5 w-100">
                        <h3>개인정보</h3>
                        <div>
                            <ul>
                                <li>생년월일</li>
                                <li>ㅇㅇ</li>
                                <li>ㅇㅇ</li>
                                <li>ㅇㅇ</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 my-2">
                    <div className="card p-5">
                        <h3>Tech Stack</h3>
                    </div>
                </div>
                <div className="col-12 my-2">
                    <div className="card p-5">
                        <Curriculum/>
                    </div>
                </div>
            </div>
        </>
    )
}

