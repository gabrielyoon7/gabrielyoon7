import { Outlet, Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function DefaultLayout() {
  return (
    <div>
      <div className="mb-2">
        <Header />
      </div>
      <div className="container">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
}