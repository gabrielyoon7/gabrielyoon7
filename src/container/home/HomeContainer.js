
import { Link } from 'react-router-dom';

const HomeContainer = () => {
    return (
        <div>
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">안녕하세요</h1>
                    <p className="col-md-8 fs-4">신입 프론트엔드 개발자를 희망하는 윤주현입니다.</p>
                    <button className="btn btn-primary btn-lg" type="button" onClick={() => { window.location.href = 'https://github.com/gabrielyoon7' }}>Github에서 보기</button>
                </div>
            </div>

            <div className="row align-items-md-stretch">
                <div className="col-md-6">
                    <Link className='text-decoration-none ' to="/profile">
                        <div className="h-100 p-5 text-white bg-dark rounded-3">
                            <h2>Profile</h2>
                            <p>인생실화를 거짓 없이 들려드립니다.</p>
                            <button className="btn btn-outline-light" type="button">고고씽 <i className="bi bi-arrow-right"></i></button>
                        </div>
                    </Link>
                </div>
                <div className="col-md-6">
                    <Link className='text-decoration-none ' to="/career">
                        <div className="h-100 p-5 text-dark bg-light border rounded-3">
                            <h2>Career History</h2>
                            <p>프론트엔드 개발자가 되기 위해 걸어온 길</p>
                            <button className="btn btn-outline-secondary" type="button">고고씽 <i className="bi bi-arrow-right"></i></button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HomeContainer;