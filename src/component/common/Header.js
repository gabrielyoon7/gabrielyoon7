import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";


const Header = () => {
    const [isSignIn, setSignIn] = useState(false); //임시로 해놓음
    return (
        <>
            <nav className="navbar navbar-expand-lg px-sm-5 fixed-top shadow-sm bg-white" >
                <div className="container-fluid">
                    <Link to='/' className="navbar-brand" >Gabriel Ju Hyun, Yoon</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        </ul>
                        <div className="d-flex" >
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link to='/' className="nav-link active" aria-current="page" >Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/profile' className="nav-link" href="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/career' className="nav-link" href="#">History</Link>
                                </li>
                                {/* <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Projects
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                        <li><a className="dropdown-item" href="#">Another action</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </li> */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="" id="dropdown-basic" className="nav-link dropdown-toggle">
                                        {/* <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle" /> */}
                                        Projects
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">프로젝트1</Dropdown.Item>
                                        <Dropdown.Item href="#/action-1">프로젝트2</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {/* <li className="nav-item">
                                    <a className="nav-link disabled">Disabled</a>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Header;