import { Box, Card, CardActionArea } from "@mui/material"
import { useNavigate } from "react-router-dom";

export default ({ children, to }) => {
    const navigate = useNavigate();
    return (
        <Card
            onClick={() => to && navigate(to)}
        >
            <CardActionArea>
                <Box p={5}>
                    {children}
                </Box>
            </CardActionArea>
        </Card>
    )
}