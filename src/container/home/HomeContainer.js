
import { Link } from 'react-router-dom';

const HomeContainer = () => {
    return (
        <div className=''>
            <a className='text-decoration-none text-dark' href='https://github.com/gabrielyoon7' target='_blank'>
                <div className="p-5 mb-4 rounded-3 border">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold">안녕하세요</h1>
                        <p className="col-md-8 fs-4">신입 프론트엔드 개발자를 희망하는 윤주현입니다.</p>
                        <button className="btn btn-outline-dark btn-lg rounded-3" type="button">Github에서 보기</button>
                    </div>
                </div>
            </a>

            <div className="row align-items-md-stretch">
                <div className="col-md-6 mb-4">
                    <Link className='text-decoration-none ' to="/profile">
                        <div className="h-100 p-5 text-dark border rounded-3">
                            <h2>About Me</h2>
                            <p>자기소개</p>
                            <button className="btn btn-outline-dark" type="button">확인하기 <i className="bi bi-arrow-right"></i></button>
                        </div>
                    </Link>
                </div>
                <div className="col-md-6 mb-4">
                    <Link className='text-decoration-none ' to="/career">
                        <div className="h-100 p-5 text-dark border rounded-3">
                            <h2>Career History</h2>
                            <p>프론트엔드 개발자가 되기 위해 걸어온 길</p>
                            <button className="btn btn-outline-dark" type="button">확인하기 <i className="bi bi-arrow-right"></i></button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HomeContainer;