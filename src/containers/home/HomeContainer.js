
import { Link } from 'react-router-dom';

const HomeContainer = () => {
    return (
        <div className=''>
            <div className='text-decoration-none text-dark'>
                <div className="p-5 mb-4 rounded-4 border-primary border bg-white">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold">안녕하세요</h1>
                        <p className="col-md-8 fs-4">신입 웹 개발자를 희망하는 윤주현입니다.</p>
                        <a className="btn btn-outline-dark btn-lg rounded-3" type="button" href='https://github.com/gabrielyoon7' target='_blank'>Github에서 보기</a>
                    </div>
                </div>
            </div>

            <div className="row align-items-md-stretch">
                <div className="col-md-6 mb-4">
                    <Link className='text-decoration-none ' to="/profile">
                        <div className="h-100 p-5 text-dark border rounded-4 border-primary bg-white">
                            <h2>About Me</h2>
                            <p>저에 대해 소개합니다.</p>
                            <button className="btn btn-outline-dark" type="button">확인하기 <i className="bi bi-arrow-right"></i></button>
                        </div>
                    </Link>
                </div>
                <div className="col-md-6 mb-4">
                    <Link className='text-decoration-none ' to="/career">
                        <div className="h-100 p-5 text-dark border rounded-4 border-primary bg-white">
                            <h2>Career History</h2>
                            <p>개발자가 되기 위해 걸어온 길</p>
                            <button className="btn btn-outline-dark" type="button">확인하기 <i className="bi bi-arrow-right"></i></button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HomeContainer;