import CareerHistoryContainer from "containers/history/CareerHistoryContainer";
import HomeContainer from "containers/home/HomeContainer";
import ProfileContainter from "containers/profile/ProfileContainter";

const homeRoutes = [
    {
        path: '/',
        element: <HomeContainer/>,
    },
    {
        path: '/career',
        element: <CareerHistoryContainer/>,
    },
    {
        path: '/profile',
        element: <ProfileContainter/>,
    },
];
export default homeRoutes;