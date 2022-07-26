import "./profile.css";
import me from '../../assets/img/me.jpg'
import Table from "../../component/Table";

export default () => {
    const curriculum = [
        {year: '2019-1', id: 'AS249', title: '대학영어1', type1:'언어', type2:'', point:3, design_point:0, grade:'A+'},
        {year: '2019-1', id: 'AS371', title: '사고와표현', type1:'사고', type2:'', point:3, design_point:0, grade:'A+'},
        {year: '2019-1', id: 'AS711', title: '수리논리', type1:'수리', type2:'인선', point:3, design_point:0, grade:'B'},
        {year: '2019-1', id: 'AS928', title: '미분적분학1', type1:'수리', type2:'인선', point:3, design_point:0, grade:'B+'},
        {year: '2019-1', id: 'AS955', title: '일반물리학및실험Ⅰ', type1:'수리', type2:'인선', point:3, design_point:0, grade:'B+'},
        {year: '2019-1', id: 'DD032', title: 'C프로그래밍기초', type1:'컴공', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2019-1', id: 'DT704', title: '컴퓨터공학부전공및진로탐색', type1:'전필', type2:'인선', point:1, design_point:0, grade:'P'},
        {year: '2019-2', id: 'AS250', title: '대학영어2', type1:'언어', type2:'', point:3, design_point:0, grade:'B+'},
        {year: '2019-2', id: 'AS360', title: '진리탐구', type1:'진', type2:'', point:2, design_point:0, grade:'B+'},
        {year: '2019-2', id: 'AS659', title: '일반확률론', type1:'수리', type2:'인선', point:3, design_point:0, grade:'B'},
        {year: '2019-2', id: 'AS956', title: '일반물리학및실험Ⅱ', type1:'수리', type2:'인선', point:3, design_point:0, grade:'B'},
        {year: '2019-2', id: 'DD746', title: '창의기초설계', type1:'컴공', type2:'인필', point:3, design_point:3, grade:'A+'},
        {year: '2019-2', id: 'DD801', title: 'C프로그래밍', type1:'컴공', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2020-1', id: 'AS460', title: '공감소통', type1:'성', type2:'', point:2, design_point:0, grade:'A+'},
        {year: '2020-1', id: 'CS343', title: '자료구조론', type1:'전선', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2020-1', id: 'DD013', title: '컴퓨터과학개론', type1:'수리', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2020-1', id: 'DD017', title: '이산수학', type1:'전선', type2:'인필', point:3, design_point:0, grade:'A'},
        {year: '2020-1', id: 'DD750', title: '자바프로그래밍', type1:'전선', type2:'인선', point:3, design_point:1, grade:'A'},
        {year: '2020-1', id: 'DH072', title: '프로그래밍기초', type1:'수리', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2020-1', id: 'EF624', title: '컴퓨터구조', type1:'전선', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2020-2', id: 'AS287', title: '특허와기술개발', type1:'사회', type2:'인필', point:3, design_point:0, grade:'A+'},
        {year: '2020-2', id: 'AS502', title: '직업기초능력의이해', type1:'계발', type2:'', point:2, design_point:0, grade:'P'},
        {year: '2020-2', id: 'DD015', title: '객체지향프로그래밍', type1:'전선', type2:'인선', point:3, design_point:1, grade:'A+'},
        {year: '2020-2', id: 'DD727', title: '데이터베이스', type1:'전선', type2:'인선', point:3, design_point:0, grade:'A'},
        {year: '2020-2', id: 'DD747', title: '수치계산', type1:'수리', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2020-2', id: 'DD771', title: '계산이론', type1:'컴공', type2:'인선', point:3, design_point:0, grade:'B+'},
        {year: '2020-2', id: 'EF656', title: '컴퓨터네트워크', type1:'전선', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2020-2', id: 'YA029', title: '창의적문제해결전략', type1:'미래', type2:'인선', point:3, design_point:0, grade:'A'},
        {year: '2021-1', id: 'AS916', title: '공학윤리', type1:'가사', type2:'인필', point:3, design_point:0, grade:'A+'},
        {year: '2021-1', id: 'DD316', title: '소프트웨어공학', type1:'전선', type2:'인선', point:3, design_point:1, grade:'A+'},
        {year: '2021-1', id: 'DD724', title: '운영체제', type1:'전선', type2:'인선', point:3, design_point:0, grade:'A'},
        {year: '2021-1', id: 'DD725', title: '웹프로그래밍', type1:'컴공', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2021-1', id: 'DD772', title: '알고리듬', type1:'전선', type2:'인선', point:3, design_point:0, grade:'B+'},
        {year: '2021-1', id: 'DD808', title: '정보보호개론', type1:'전선', type2:'인선', point:3, design_point:0, grade:'B+'},
        {year: '2021-2', id: 'AS519', title: '기업가정신과기업가적행동', type1:'취창', type2:'', point:3, design_point:0, grade:'P'},
        {year: '2021-2', id: 'DD731', title: '모바일프로그래밍', type1:'컴공', type2:'인선', point:3, design_point:0, grade:'A+'},
        {year: '2021-2', id: 'DD755', title: '분산및병렬처리', type1:'컴공', type2:'인선', point:3, design_point:1.5, grade:'A+'},
        {year: '2021-2', id: 'DD809', title: '컴퓨터공학개별진로연구', type1:'컴공', type2:'인선', point:1, design_point:0, grade:'P'},
        {year: '2021-2', id: 'DD812', title: '지능웹설계', type1:'컴공', type2:'인선', point:3, design_point:1.5, grade:'A+'},
        {year: '2021-2', id: 'DD814', title: '네트워크보안', type1:'컴공', type2:'인선', point:3, design_point:1, grade:'A'},
        {year: '2022-1', id: 'DD313', title: '인공지능', type1:'전선', type2:'인선', point:3, design_point:1, grade:'B'},
        {year: '2022-1', id: 'DD825', title: '기업용소프트웨어실무', type1:'컴공', type2:'인선', point:3, design_point:0, grade:'A'},
        {year: '2022-1', id: 'DD826', title: '차세대프로그래밍언어', type1:'컴공', type2:'인선', point:3, design_point:0, grade:'A'},
        {year: '2022-1', id: 'DD845', title: '컴퓨터공학기초캡스톤디자인', type1:'컴공', type2:'인필', point:3, design_point:1.5, grade:'A+'},
        {year: '2022-1', id: 'DD846', title: '컴퓨터공학심화캡스톤디자인', type1:'컴공', type2:'인필', point:3, design_point:3, grade:'A+'},
    ]

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
                        <h3>Curriculum</h3>
                        <Table data={curriculum} rowsPerPage={30} />
                    </div>
                </div>
            </div>
        </>
    )
}

