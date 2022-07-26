import "./profile.css";
import me from '../../assets/img/me.jpg'
import Curriculum from "./Curriculum";
import TechStack from "./TechStack";

export default () => {


    return (
        <>
            <div className="row">
                <div className="col-md-4 my-2 d-flex align-items-stretch">
                    <div className="card w-100">
                        <div className="d-flex flex-column align-items-center text-center my-auto">
                            <img className="img-fluid rounded-4 mb-3" src={me} width={140}></img>

                            <h2 className="fw-normal">윤주현</h2>
                            <p>계속 전진하겠습니다.</p>
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
                        {/* <h3>개인정보</h3> */}
                        <div>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th colSpan="2">기본 정보</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>생년월일</td>
                                        <td>1996. 03. 25</td>
                                    </tr>
                                    <tr>
                                        <td>학력</td>
                                        <td>경기대학교 컴퓨터공학부<br /> (2017.3 ~ 2023.2)</td>
                                    </tr>
                                    <tr>
                                        <td>주소</td>
                                        <td><span>경기도 하남시</span><span>미사강변호반써밋아파트</span></td>
                                    </tr>
                                    <tr>
                                        <td>약력</td>
                                        <td>
                                            <ul>
                                                <li>경기대학교 SW기초 튜터 (2020.9 ~ 2021.12)</li>
                                                <li>경기대 컴퓨터공학부 홈페이지 개발팀 팀장 (2020.10 ~ 2021.12)</li>
                                                <li>경기대학교 분산병렬컴퓨팅연구실 (2021.7 ~ )</li>
                                                <li>경기대학교 SW상상기업 아보카도 팀장 (2021.10 ~ 2022.10)</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>관심분야</td>
                                        <td>
                                            프론트엔드(1순위), 백엔드(2순위)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 my-2">
                    <div className="card p-5">
                        <TechStack />
                    </div>
                </div>
                <div className="col-12 my-2">
                    <div className="card p-5">
                        <Curriculum />
                    </div>
                </div>
            </div>
        </>
    )
}

