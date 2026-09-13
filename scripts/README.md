# 커밋 기록 정리

## 자동 실행

`main`에 PR을 merge하거나 직접 push하면 기존 GitHub Pages 워크플로가 빌드·배포를 완료한 뒤 기록을 커밋 하나로 정리합니다. 배포가 실패하면 기록 정리도 실행하지 않습니다. 처리 도중 `main`에 새 변경이 들어오면 이전 실행은 정리를 건너뛰거나 안전하게 실패하며, 다음 배포 실행에서 정리합니다.

GitHub에서 실행되므로 Mac과 Windows에 자동 실행 도구를 설치할 필요가 없습니다. 이 워크플로 변경을 `main`에 반영하면 활성화됩니다. 브랜치 보호 또는 ruleset이 강제 push를 막고 있다면 Actions가 허용되도록 저장소 설정이 필요합니다.

기본 `GITHUB_TOKEN`으로 한 push는 워크플로를 다시 실행하지 않으므로 무한 반복하지 않습니다. 참고: [GitHub 공식 문서](https://docs.github.com/en/actions/concepts/security/github_token).

## Mac / Windows 작업 사본 동기화

원격 기록이 바뀌므로 다른 컴퓨터에서 작업을 시작하기 전에 로컬 `main`을 맞춰야 합니다. 아래 명령은 **보관할 로컬 변경과 미푸시 커밋이 없는 경우에만** 실행하세요. 로컬 `main`의 변경은 덮어씁니다. macOS 터미널과 Windows PowerShell에서 동일합니다.

```sh
git fetch origin
git switch main
git reset --hard origin/main
```

미완료 작업은 먼저 별도 브랜치에 커밋해 보관하거나 `git stash -u`로 저장하세요. 기록 정리 이전에 만든 작업 브랜치/PR은 공통 조상이 사라질 수 있습니다. 그런 경우 최신 `origin/main`에서 새 브랜치를 만든 뒤 필요한 작업 커밋만 cherry-pick하세요.

## 수동 실행

Node.js가 설치되어 있으면 아래 명령도 Mac과 Windows에서 동일하게 사용할 수 있습니다.

변경 내용을 먼저 커밋한 다음 실행합니다. 실행할 때마다 **현재 브랜치**의 최신 파일 내용과 커밋 메시지를 보존한 새 루트 커밋 하나를 만듭니다. 작성자와 시각은 실행자의 Git 설정 및 현재 시각으로 갱신됩니다.

```sh
npm run history:reset
```

GitHub의 `origin`에 있는 같은 이름의 브랜치에도 반영하려면:

```sh
npm run history:reset -- --push
```

`--push`는 원격 상태를 먼저 가져와 로컬에 포함되어 있는지 확인하고, `--force-with-lease`로 덮어씁니다. 원격에만 있는 변경이 있으면 중단합니다. 브랜치 보호 규칙에 따라 강제 푸시가 거절될 수 있습니다. 푸시가 실패해도 로컬 정리는 이미 완료된 상태입니다. 이 경우 출력된 Previous HEAD로 `git reset --soft <Previous-HEAD>`를 실행하면 로컬 브랜치를 복구할 수 있습니다.

다른 브랜치, 태그, reflog, 기존 클론 및 GitHub 내부에 남은 객체까지 영구 삭제하는 명령은 아닙니다.
