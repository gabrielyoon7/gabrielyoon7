import CareerHistoryContainer from "containers/history/CareerHistoryContainer";
import HomeContainer from "containers/home/HomeContainer";
import ProfileContainter from "containers/profile/ProfileContainter";

const homeRoutes = [
    {
        path: '/',
        element: <HomeContainer/>,
        name:'',
        description:''
    },
    {
        path: '/career',
        element: <CareerHistoryContainer/>,
        name:'프로젝트 이력',
        description:'개발자가 되기 위해 걸어온 길'
    },
    {
        path: '/profile',
        element: <ProfileContainter/>,
        name:'프로필',
        description:'저에 대해 소개합니다.'
    },
];
export default homeRoutes;