import { Box, Card, CardActionArea } from "@mui/material"
import React from "react";
import { useNavigate } from "react-router-dom";

const HomeCard = ({ children, to, actionArea, onClick }) => {
    const navigate = useNavigate();
    return (
        <Card
            sx={{ height: '100%', width: '100%' }}
            onClick={
                () => {to && navigate(to); onClick&&onClick();}
            }
        >
            {
                actionArea
                    ?
                    <CardActionArea
                        sx={{
                            height: '100%',
                            width: '100%',
                            alignItems: 'flex-start',
                            flexGrow: 1,
                            flexDirection: 'column',
                        }}
                    >
                        <Box p={5}>
                            {children}
                        </Box>
                    </CardActionArea>
                    :
                    <Box p={5}>
                        {children}
                    </Box>
            }
        </Card>
    )
}

export default React.memo(HomeCard);