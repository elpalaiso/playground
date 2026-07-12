# SNOOZE — 엔진 표면 문서 (Codex 아트 패스용)

결정 (M) 빌드. 사양 원본: 볼트 `claude/65-스누즈 마스터 설계.md` (사전 등록 — 수치·문장 변경은 로그 diff 의무).

## 구조

`index.html` 단일 파일. `<script>` 내부가 두 층으로 분리:

- `/*ENGINE-START*/ ... /*ENGINE-END*/` — 순수 로직 (DOM 없음). **이 블록은 아트 패스에서 수정 금지.**
- 이후 UI 층 — DOM·CSS·연출. 아트 패스 대상.

시뮬 하니스가 마커로 엔진을 추출해 node에서 돌린다:
`new Function(html.split("/*ENGINE-START*/")[1].split("/*ENGINE-END*/")[0] + "; return E;")()`
UI 변경 후에도 이 추출이 깨지지 않아야 한다 (마커 보존).

## 데이터 (엔진 내)

- `E.DAYS[10]` — 아침 10개 (챕터 1 이사 첫 주 0-4 / 챕터 2 첫 출근 주 5-9). 필드: `walk, depart, coffee, natural, noWake, warnBand`, `alarms[]`.
- alarm kinds: `wake / window / call / door / leave / street`. 특수 플래그: `missIfBusy`(통화 중 부재중), `lock`(미루기 불가), `wait`(문 대기 횟수).
- `E.CARDS[12]` — 내일 카드. 전부 이득 `up(s)` + 제약 `down(s)` 쌍. 등급 없음 (메타 블랙리스트).
- `E.DRIPS[10]` — 밤 사이 서사 (brief 화면). `E.MAILS[5]`/`E.MAILS2[5]` — 우편.
- 계승 (`E.carries`): 잔여 `pickup/pickup2/pill/call/chore` · 규칙 `{lock:id}/route/bigstep` · 예외 `light/rhythm`.

## 판정 게이트 (타협 금지)

- P7: 콜드 오픈 무설명 진입 유지.
- P8 강화판: 예보줄("이대로면")은 매 입력 직후 같은 화면 재계산 — 지연 금지.
- 밸런스 시뮬: 클린 10일 (무대응 WARPED / 성실 HALF / 설계 루트 PERFECT), 풀 체인 10/10, 카드×데이 120, 퍼즈 200시드×10일 무예외 — UI 변경 후 재실행으로 회귀 확인.

## 아트 방향 (합의 준수)

CLI 앰버 CRT (사용자 확정 취향, 결정 K/18차). 게임판 토큰 라틴 고정 (전각 정렬 회피), 한글은 라벨·문장 층. 이모지 금지. 큰 글자·고대비·한 손 엄지. prefers-reduced-motion 지원 유지.
