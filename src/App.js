import logo from './logo.svg';
import './App.css';
import HomeContainer from './containers/home/HomeContainer';
import { Link, Route, Routes } from 'react-router-dom';
import DefaultLayout from './components/common/DefaultLayout';
import CareerHistoryContainer from './containers/history/CareerHistoryContainer';
import ProfileContainter from './containers/profile/ProfileContainter';
import homeRoutes from 'api/routes/homeRoutes';

function App() {
  return (
    <Routes>
      {/* 이 Layout 안에 갇히게 됨... nested된 Container들은 Layout의 Outlet으로 연결된다 */}
      <Route path="/" element={<DefaultLayout />}>
        {/* DefaultLayout의 Outlet으로 연결되는 부분 시작 */}
        {homeRoutes.map((route)=><Route key={route.path} path={route.path} element={route.element} />)}
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>잘못된 요청입니다!</p>
            </main>
          }
        />
        {/* DefaultLayout의 Outlet으로 연결되는 부분 끝 */}
      </Route>
    </Routes>
  );
}

export default App;
