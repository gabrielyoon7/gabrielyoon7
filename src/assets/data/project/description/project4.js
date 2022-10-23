const long_description = `
### [분산병렬컴퓨팅시스템연구실 전기차 충전소 추천 앱]

현재 소속되어있는 연구실에서 진행하는 프로젝트입니다. 

교수님께서 학부연구생들에게 각자 주도하여 프로젝트를 진행할 수 있는 기회를 주셨는데, 저는 전기차 충전 관련한 사회적인 현상을 가까이서 지켜본 경험이 있어 이 주제로 선택하게 되었습니다.

중간에 스케쥴 등의 이유로 프로젝트가 중단됐으나 최근 다시 활발히 개발을 이끌어가고 있어 개발 속도에 탄력이 붙은 상태입니다. 

한국환경공단으로부터 받은 전기차 충전소 및 충전기 데이터를 이용하여 충전 장소를 추천해주는 앱으로 기본적인 지도 기능, 충전소 검색 기능, 데이터 자동 수집 등 거의 모든 기능이 구현되어있습니다.

한국기술학회의 2022 추계종합학술대회 및 대학생논문경진대회 참가를 앞두고 있는 상황입니다.

#### 개발 현황

    . [Client (Android/iOS Expo Application)]
    ├── 충전소 조회 (지도)
    │   ├── 충전소 실시간 검색
    │   ├── 지도 확대/축소/현위치
    │   │   └── 마커 클러스터링 적용
    │   ├── 충전소 리스트
    │   │   ├── 충전소 상태별 색상 표시
    │   │   └── 거리순 정렬
    │   ├── 충전소 조회
    │   │   ├── 충전소 간단 정보
    │   │   │    ├── 충전기 실시간 사용 정보
    │   │   │    └── 충전소 정보 간략히 제공
    │   │   └── 충전소 상세 정보
    │   │        ├── 충전소 정보 상세히 제공
    │   │        ├── 충전기 실시간 사용 정보
    │   │        ├── 충전기 사용 통계
    │   │        ├── 충전소 사용 통계
    │   │        ├── 즐겨찾기 등록
    │   │        └── 가까운 충전소 즉시 조회 및 이동
    │   ├── 충전소 필터링
    │   │   ├── 주차비 여부
    │   │   ├── 충전기 종류(DC차데모 / DC콤보 / AC완속 / AC3상)
    │   │   ├── 충전기 용량
    │   │   ├── 충전 방식
    │   │   ├── 충전기 상태
    │   │   ├── 이용자 제한
    │   │   └── 운영기관 필터링
    │   ├── 충전소 새로 고침
    │   └── 지도 테마 설정 (주간/야간 자동화)
    ├── 계정
    │   ├── 회원가입
    │   └── 로그인/로그아웃
    ├── 충전소 전국단위 검색
    │   ├── 충전소 지역/분류 선택 기능
    │   └── 검색 결과 리스트 출력 기능
    ├── 충전 일정 관리
    │   ├── (제작중)
    │   └── (제작중)
    └── 나의 자동차 설정
        ├── (제작중)
        └── (제작중)

    . [Server (Node.js Application)]
    └── App 사용에 필요한 RESTful API 형태로 구현

    . [Data Manager V2 ( Node.js Application )]
    ├── KECO로 부터 충전기 데이터 실시간 수신
    ├── KECO로 부터 수신 받은 데이터를 충전소와 충전기로 분리
    ├── 충전소와 충전기 데이터를 새 데이터로 overwrite (벌크형태로 저장/관리하여 속도 개선)
    ├── 충전기 사용 여부를 통계 데이터에 업데이트
    ├── 오래된 충전기 사용 통계는 자동 삭제
    └── 이 모든 과정을 주기적으로 자동 반복 처리


![App Screenshot](project_img/4/main.gif)
![App Screenshot](project_img/4/map.gif)
![App Screenshot](project_img/4/favorite.gif)
![App Screenshot](project_img/4/search.gif)
![App Screenshot](project_img/4/location.gif)
![App Screenshot](project_img/4/modalSmall.gif)
![App Screenshot](project_img/4/modalBig.gif)
![App Screenshot](project_img/4/list.gif)
![App Screenshot](project_img/4/filter.gif)
![App Screenshot](project_img/4/theme.gif)

![Web Screenshot](project_img/4/data.gif)


`
export default long_description;