
import RadarIcon from '@mui/icons-material/Radar';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import SchoolIcon from '@mui/icons-material/School';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import WebIcon from '@mui/icons-material/Web';
import ScienceIcon from '@mui/icons-material/Science';
import GroupsIcon from '@mui/icons-material/Groups';
import LensBlurIcon from '@mui/icons-material/LensBlur';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const life = [
    { 
        period_start: "", 
        period_end: "2015.2", 
        title: "고등학교", 
        description: "졸업", 
        sub_description:'',
        color: undefined, 
        variant: undefined,
        icon:undefined,
    },
    { 
        period_start: "2015.01", 
        period_end: "2016.11", 
        title: "대성학원", 
        description: "재수삼수", 
        sub_description:'',
        color: undefined, 
        variant: undefined,
        icon:undefined,
    },
    { 
        period_start: "2017.02", 
        period_end: "2018.11", 
        title: "55사단 170연대 1대대", 
        description: "군생활", 
        sub_description:'분대장 (2018.3 ~ 2018.11)',
        color: 'success', 
        variant: 'outlined',
        icon:<RadarIcon/>
    },
    { 
        period_start: "2017.03", 
        period_end: "", 
        title: "경기대학교 입학", 
        description: "컴퓨터과학과 17학번", 
        sub_description:'정시 모집',
        color: 'secondary', 
        variant: undefined,
        icon:<SchoolIcon/>,
    },
    { 
        period_start: "2020.09", 
        period_end: "2021.12", 
        title: "경기대학교 감성SW교육센터", 
        description: "소프트웨어기초 교과목 튜터", 
        sub_description:'Python / 튜터 대표 (2021.3 ~ 2021.12)',
        color: 'warning', 
        variant: 'outlined',
        icon:<GroupsIcon/>,
    },
    { 
        period_start: "2020.10", 
        period_end: "", 
        title: "경기대 AI컴퓨터공학부 CS-HOME", 
        description: "학과 홈페이지 유지보수 및 개발", 
        sub_description:'JSP / 팀장 (2020.10 ~ 2021.12)',
        color: 'info', 
        variant: 'outlined',
        icon:<WebIcon/>,
    },
    { 
        period_start: "2021.07", 
        period_end: "", 
        title: "분산병렬컴퓨팅연구실", 
        description: "학부 연구생", 
        sub_description:'',
        color: 'success', 
        variant: undefined,
        icon:<ScienceIcon/>,
    },
    { 
        period_start: "2021.09", 
        period_end: "2022.11", 
        title: "경기대학교 SW상상기업 Avocado Team", 
        description: "SW경진대회 참가 및 학습그룹", 
        sub_description:'React / 팀장',
        color: 'primary', 
        variant: undefined,
        icon:<LensBlurIcon/>,
    },
]

export default life;