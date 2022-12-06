import { Card, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "assets/theme";
import { Outlet } from "react-router-dom";
import HomeTitle from "../home/HomeTitle";
import MKBox from "../mui-components/MKBox";
import DefaultFooter from "./Footers/DefaultFooter";
import footerRoutes from "./Footers/footer.routes";
import DefaultNavbar from "./Navbars/DefaultNavbar";
import routes from "./Navbars/routes";

export default function DefaultLayout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "/signin",
          label: "Login",
          color: "info",
        }}
        sticky
      />

      {/* 대문 시작 */}
      <HomeTitle />
      {/* 대문 끝 */}

      <Card
        sx={{
          p: {
            xs: 2,
            sm: 5,
            md: 5,
            lg: 5,
            xl: 5,
            xxl: 5
          },
          mx: {
            xs: 2,
            sm: 3,
            md: 5,
            lg: 10,
            xl: 15,
            xxl: 25
          },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <Outlet />
      </Card>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </ThemeProvider>

  );
}