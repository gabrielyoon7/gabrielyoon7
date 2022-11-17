// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
// import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import RssFeedIcon from '@mui/icons-material/RssFeed';

// Images
// import logoCT from "assets/images/logo-ct-dark.png";
import MKTypography from "components/common/mui-components/MKTypography";
import { Box } from "@mui/material";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "Gabriel, Ju Hyun Yoon",
    // image: logoCT,
    route: "/",
  },
  socials: [
    {
      icon: <InstagramIcon />,
      link: "https://www.instagram.com/gabriel._.yn/",
    },
    {
      icon: <RssFeedIcon />,
      link: "https://leirbag.tistory.com/",
    },
    {
      icon: <GitHubIcon />,
      link: "https://github.com/gabrielyoon7",
    },
    // {
    //   icon: <YouTubeIcon />,
    //   link: "https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w",
    // },
  ],
  menus: [
    {
      name: "company",
      items: [
        { name: "about us", href: "https://www.creative-tim.com/presentation" },
        { name: "freebies", href: "https://www.creative-tim.com/templates/free" },
        { name: "premium tools", href: "https://www.creative-tim.com/templates/premium" },
        { name: "blog", href: "https://www.creative-tim.com/blog" },
      ],
    },
    {
      name: "resources",
      items: [
        { name: "illustrations", href: "https://iradesign.io/" },
        { name: "bits & snippets", href: "https://www.creative-tim.com/bits" },
        { name: "affiliate program", href: "https://www.creative-tim.com/affiliates/new" },
      ],
    },
    {
      name: "help & support",
      items: [
        { name: "contact us", href: "https://www.creative-tim.com/contact-us" },
        { name: "knowledge center", href: "https://www.creative-tim.com/knowledge-center" },
        { name: "custom development", href: "https://services.creative-tim.com/" },
        { name: "sponsorships", href: "https://www.creative-tim.com/sponsorships" },
      ],
    },
    {
      name: "legal",
      items: [
        { name: "terms & conditions", href: "https://www.creative-tim.com/terms" },
        { name: "privacy policy", href: "https://www.creative-tim.com/privacy" },
        { name: "licenses (EULA)", href: "https://www.creative-tim.com/license" },
      ],
    },
  ],
  copyright: (
    <>
      <Box>
        <MKTypography variant="button" fontWeight="regular">
          All rights reserved. Copyright &copy; {date} Material Kit by{" "}
          <MKTypography
            component="a"
            href="https://www.creative-tim.com"
            target="_blank"
            rel="noreferrer"
            variant="button"
            fontWeight="regular"
          >
            Creative Tim
          </MKTypography>
          .
        </MKTypography>
      </Box>
      <Box>
        <MKTypography variant="button" fontWeight="regular">
          이 테마는 Creative Tim에서 제작한 <a href="https://www.creative-tim.com/product/material-kit-react" target="_blank" rel="noreferrer">Material Kit 2 React : FREE REACTJS & MUI KIT</a>를 제 입맛대로 뜯어 고쳐 만든 프로젝트 입니다.
        </MKTypography>
      </Box>
      <Box>
        <MKTypography variant="button" fontWeight="regular">
          테마에 사용된 MK 컴포넌트만 재활용하고, 나머지 대부분의 요소는 <a href="https://mui.com/" target="_blank" rel="noreferrer">Material UI</a>를 기반으로 제작했습니다.
        </MKTypography>
      </Box>
      <Box>
        <MKTypography variant="button" fontWeight="regular">
          디자인을 제외한 대부분의 시스템은 직접 제작하였고, 해당 내용은 이 <a href='https://github.com/gabrielyoon7/gabrielyoon7'>레포지토리</a>에서 확인이 가능합니다.
        </MKTypography>
      </Box>
    </>
  ),
};
