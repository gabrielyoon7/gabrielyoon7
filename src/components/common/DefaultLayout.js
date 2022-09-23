import { Outlet, Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import HeaderMK from "./HeaderMK";

export default function DefaultLayout() {
  return (
    <div>
      <div className="mb-2">
        <Header />
        {/* <HeaderMK /> */}
      </div>
      <div>
        <div className="container mt-5 pt-4">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}