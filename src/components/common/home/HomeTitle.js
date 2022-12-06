import { Box, Container, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";

// Images
// import bgImage from "assets/img/bgImage.jpg";
import homeRoutes from "api/routes/homeRoutes";
// import MKBox from "components/common/mui-components/MKBox";
import MKTypography from "components/common/mui-components/MKTypography";

import "./HomeTitle.css";
import React from "react";

const HomeTitle = () => {
    const router = useLocation();
    const routeInfo = homeRoutes.find((item) => item.path === router.pathname);
    return (
        <>
            <Box
                minHeight="60vh"
                width="100%"
                className="titleColor"
                sx={{
                    // backgroundImage: `url(${bgImage})`,
                    // backgroundColor:'#212529',
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <Container>
                    <Stack direction={"column"} alignItems="center">
                        <MKTypography
                            variant="h1"
                            color="white"
                        >
                            {routeInfo?.name}
                        </MKTypography>
                        <MKTypography
                            variant="body1"
                            color="white"
                        >
                            {routeInfo?.description}
                        </MKTypography>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default React.memo(HomeTitle);