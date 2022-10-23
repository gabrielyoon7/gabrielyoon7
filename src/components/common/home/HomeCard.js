import { Box, Card, CardActionArea } from "@mui/material"
import { useNavigate } from "react-router-dom";

export default ({ children, to, actionArea }) => {
    const navigate = useNavigate();
    return (
        <Card
            sx={{ height: '100%', width: '100%' }}
            onClick={() => to && navigate(to)}
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