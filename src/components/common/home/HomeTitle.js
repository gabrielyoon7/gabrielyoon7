import { Container, Grid } from "@mui/material"
import { useLocation } from "react-router-dom";

// Images
import bgImage from "assets/img/bgImage.jpg";
import homeRoutes from "api/routes/homeRoutes";
import MKBox from "components/common/mui-components/MKBox";
import MKTypography from "components/common/mui-components/MKTypography";


export default () => {
    const router = useLocation();
    const routeInfo = homeRoutes.find((item) => item.path === router.pathname);
    return (
        <>
            <MKBox
                minHeight="75vh"
                width="100%"
                sx={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <Container>
                    <Grid container item xs={12} lg={7} justifyContent="center" mx="auto">
                        <MKTypography
                            variant="h1"
                            color="white"
                            mt={-6}
                            mb={1}
                            sx={({ breakpoints, typography: { size } }) => ({
                                [breakpoints.down("md")]: {
                                    fontSize: size["3xl"],
                                },
                            })}
                        >
                            {routeInfo?.name}
                        </MKTypography>
                        <MKTypography
                            variant="body1"
                            color="white"
                            textAlign="center"
                            px={{ xs: 6, lg: 12 }}
                            mt={1}
                        >
                            {routeInfo?.description}
                        </MKTypography>
                    </Grid>
                </Container>
            </MKBox>
        </>
    )
}