import { Grid, Typography } from "@mui/material";
import ResponsiveCard from "components/common/home/ResponsiveCard";
import curriculum from "../../../assets/data/curriculum";
const Score = () => {

    let allScore = 0;
    let scoredScore = 0;
    let scoredScoreCount = 0;
    let scoredScoreSum = 0;
    let majorScore = 0;
    let majorScoreCount = 0;
    let majorScoreSum = 0;
    // let electiveScore = 0;

    curriculum.map((c) => {
        allScore += c.학점;
        if (c.등급 !== 'P') {
            scoredScore += c.학점;
            scoredScoreCount++;
            scoredScoreSum += gradeToScore(c.등급);
        }
        if (c.전공 === '✅' && c.등급 !== 'P') {
            majorScore += c.학점;
            majorScoreCount++;
            majorScoreSum += gradeToScore(c.등급);
        }

    });

    return (
        <>
            <Grid item xs={12} md={6}>
                <ResponsiveCard>
                    <Typography variant="h4">
                        전체 학점
                    </Typography>
                    <Typography>
                        취득학점 : {allScore} (평점산출학점 : {scoredScore})
                    </Typography>
                    <Typography>
                        평점평균 : {Math.round(scoredScoreSum / scoredScoreCount * 100) / 100}
                    </Typography>
                </ResponsiveCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <ResponsiveCard>
                    <Typography variant="h4">
                        전공 학점
                    </Typography>
                    <Typography>
                        전공산출학점 : {majorScore} (PNP제외)
                    </Typography>
                    <Typography>
                        평점평균 : {Math.round(majorScoreSum / majorScoreCount * 100) / 100}
                    </Typography>
                </ResponsiveCard>
            </Grid>
        </>
    );
};

const gradeToScore = (grade) => {
    switch (grade) {
        case "A+":
            return 4.5;
        case "A":
            return 4.0;
        case "B+":
            return 3.5;
        case "B":
            return 3.0;
        case "C+":
            return 2.5;
        default:
            return 9999999999999;
    }
};


export default Score;