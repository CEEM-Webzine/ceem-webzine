# 📰 CEEM Webzine 관리 가이드

> 이 문서는 CEEM Webzine GitHub 저장소의 관리자를 위한 안내서입니다.
> 코딩을 전혀 몰라도 이 문서만 따라 하면 웹진을 발간할 수 있습니다.

---

## 📁 저장소 구조 한눈에 보기

```
ceem-webzine/
│
├── 🚫 index.html          ← **절대 건드리지 마세요**
├── 🚫 style.css           ← **절대 건드리지 마세요**
├── 🚫 main.js             ← **절대 건드리지 마세요**
│
├── ✅ data.json           ← **매달 업데이트하는 파일 (현재 최신호)**
│
├── assets/
│   └── images/            ← 논문 그림 이미지 저장 폴더
│
└── archives/              ← 과거호 JSON 파일 보관 폴더
    ├── 2025-01.json
    ├── 2025-02.json
    └── ...
```

---

## 🚫 절대 건드리면 안 되는 파일

아래 세 파일은 웹진의 뼈대입니다. **내용을 수정하면 웹사이트 전체가 깨질 수 있습니다.**

| 파일 | 역할 |
|------|------|
| `index.html` | 웹진의 전체 틀(레이아웃) |
| `style.css` | 디자인, 색상, 글꼴 등 꾸미기 |
| `main.js` | 데이터를 읽어서 화면에 표시하는 프로그램 |

> ✅ **관리자가 매달 수정하는 파일은 `data.json` 하나뿐입니다.**

---

## 🖼️ 이미지 파일 이름 규칙

이미지는 나중에 archive 관리를 편하게 하기 위해 **아래 규칙에 맞게 이름을 지어주세요.**

### 규칙

```
fig_[년도][Issue번호]_[논문순서].png
```

### 예시

| 파일명 | 의미 |
|--------|------|
| `fig_202512_1.png` | 2025년 12번째호, 첫 번째 논문 그림 |
| `fig_202512_2.png` | 2025년 12번째호, 두 번째 논문 그림 |
| `fig_202601_1.png` | 2026년 1번째호, 첫 번째 논문 그림 |

> 이렇게 이름을 정해두면, 나중에 archive로 넘길 때 이미지 파일을 **그대로 두고** JSON 파일만 복사해서 이름을 바꾸면 됩니다. 이미지는 계속 `assets/images/` 폴더에 쌓아두면 됩니다.

---

## ✍️ 신간호 발간 방법 (단계별)

### 1단계 — 논문 그림 이미지 올리기

1. GitHub 저장소에서 `assets/images/` 폴더를 클릭합니다.
2. 우측 상단 **`Add file` → `Upload files`** 를 클릭합니다.
3. 규칙에 맞게 이름을 지은 이미지 파일(예: `fig_202602_1.png`)을 끌어다 놓습니다.
4. 아래쪽 **`Commit changes`** 버튼을 눌러 저장합니다.

---

### 2단계 — `data.json` 수정하기

`data.json` 파일이 현재 웹진에 표시되는 내용의 전부입니다.

1. GitHub에서 `data.json` 파일을 클릭합니다.
2. 우측 상단 **연필 아이콘(✏️ Edit)** 을 클릭합니다.
3. 아래 구조를 참고하여 내용을 수정합니다.
4. 수정이 끝나면 **`Commit changes`** 버튼을 눌러 저장합니다.

---

### `data.json` 구조 설명

```json
{
  "issueInfo": {
    "vol": "Vol. 13",
    "issue": "Issue 1",
    "date": "February 2026",
    "editorsNote": "이번 호 에디터 노트 내용을 여기에 씁니다."
  },
  "citationTip": "인용 관련 안내 문구를 여기에 씁니다. ex. 2024-2026 CEEM 인용을 부탁드립니다. 웹진 젤 하단에 표시됨 (30~50자 이내)",
  "papers": [
    {
      "badges": ["editor", "original-article"],
      "journal": "Clin Exp Emerg Med",
      "yearInfo": "2026; 13(1): 1-10",
      "title": "논문 제목을 여기에 입력",
      "author": "Hong GD, Kim JS, Lee HK",
      "abstract": "논문 초록 내용을 여기에 입력합니다.\n두 번째 줄 내용입니다.\n세 번째 줄 내용입니다.",
      "pearl": "이 논문의 핵심 한 줄 요약 문장을 여기에 씁니다.",
      "doiLink": "https://doi.org/10.xxxx/xxxxx",
      "image": "assets/images/fig_202602_1.png",
      "caption": "그림 설명을 여기에 씁니다.",
      "reverse": false
    },
    {
      "badges": ["review", "imaging"],
      "journal": "NEJM",
      "yearInfo": "2026; 13(1): 11-20",
      "title": "두 번째 논문 제목",
      "author": "Park SH, Choi MJ",
      "abstract": "첫 번째 줄 내용입니다.\n두 번째 줄 내용입니다.\n세 번째 줄 내용입니다.",
      "pearl": "두 번째 논문 핵심 요약.",
      "doiLink": "https://doi.org/10.xxxx/xxxxx",
      "image": "assets/images/fig_202602_2.png",
      "caption": "두 번째 그림 설명.",
      "reverse": true
    }
  ]
}
```

---

### 각 항목 설명

| 항목 | 설명 |
|------|------|
| `vol` / `issue` | 권호 정보 |
| `date` | 발간 연월 |
| `editorsNote` | 에디터 노트 본문 |
| `citationTip` | Citation Tip 섹션에 표시될 문구 (30~50자 이내 자유 텍스트) |
| `badges` | 논문 유형 배지. `original-article`, `review`, `editor` 등 |
| `journal` | 저널명 직접 입력 (예: `Clin Exp Emerg Med`, `NEJM`) |
| `yearInfo` | 논문 출판 연도 및 권호 페이지 정보 |
| `title` | 논문 제목 |
| `author` | 저자명 |
| `abstract` | 초록 |
| `pearl` | 핵심 요약 한 줄 (PEARL 박스에 표시됨) |
| `doiLink` | 논문 DOI 링크 |
| `image` | 그림 파일 경로 (assets/images/파일명) |
| `caption` | 그림 아래 설명 |
| `reverse` | `true`로 하면 그림이 왼쪽, 텍스트가 오른쪽으로 배치됨 (건드리지 마세요) |

> 논문을 추가하려면 `{ ... }` 블록 전체를 복사해서 마지막 논문 뒤에 `, ` 를 붙이고 붙여넣기 하면 됩니다.

---

### ✏️ abstract / pearl 작성 팁

#### 줄바꿈
줄을 바꾸고 싶은 위치에 `\n`을 넣습니다. **실제 Enter는 누르지 마세요.**
```json
"abstract": "첫 번째 문단 내용입니다.\n두 번째 문단 내용입니다."
```

#### 큰따옴표(`"`) 넣기
텍스트 안에 큰따옴표를 쓰려면 앞에 `\`(₩ 키)를 붙입니다.
```json
"abstract": "2025년 NEJM에 발표된 \"Ketamine or Etomidate\" 연구에 따르면..."
```

#### 볼드체(굵게) 강조
강조할 부분을 `<b>` 태그로 감쌉니다.
```json
"abstract": "전체 사망률에서 <b>두 약제 간 유의한 차이는 없었습니다.</b> 다만 저혈압 발생률은..."
```

> ⚠️ 세 가지 모두 `pearl` 필드에도 동일하게 적용됩니다.

---

### 🏷️ 사용 가능한 배지 목록

논문 카드 상단에 표시되는 색상 배지입니다. **`badges` 항목에 아래 값을 그대로 복사해서** 넣으면 됩니다.
배지는 여러 개를 함께 쓸 수 있습니다. (예: 논문 유형 1개 + 카테고리 1개)

#### 📌 논문 유형 배지 (Article Type)

| `badges`에 입력할 값 | 화면에 표시되는 이름 | 색상 |
|---|---|---|
| `original-article` | Original article | 🟢 그린 |
| `systematic-review` | Systematic review | 🟣 보라 |
| `guidelines` | Guidelines | 🔵 진한 파란색 |
| `brief-review` | Brief review | 🩵 틸(청록) |
| `correspondence` | Correspondence | 💜 인디고 |
| `commentary` | Commentary | 🪻 바이올렛 |
| `editorial` | Editorial | 🟢 딥 티일 |
| `review` | Review article | 🩶 웜그레이 |
| `case` | Case report | 🩶 블루그레이 |

#### 📌 카테고리 배지 (Category)

| `badges`에 입력할 값 | 화면에 표시되는 이름 | 색상 |
|---|---|---|
| `airway` | Airway | 🔵 스카이 블루 |
| `critical-care` | Critical care | 🟡 앰버(황금) |
| `education` | Education | 🩵 시안 |
| `pediatrics` | Pediatrics | 🟤 딥로즈 |
| `public-health` | Public health | 🟢 에메랄드 그린 |
| `resuscitation` | Resuscitation | 🟠 오렌지 |
| `ems` | EMS | 🟡 앰버 주황 |
| `trauma` | Trauma | 🟤 버건디 |
| `toxicology` | Toxicology | 🫒 올리브 그린 |
| `imaging` | Imaging | 🩶 슬레이트 |
| `digital-health` | Digital health & Informatics | 🩵 하늘 |

#### 📌 특별 배지

| `badges`에 입력할 값 | 화면에 표시되는 이름 | 색상 |
|---|---|---|
| `editor` | Editor's Choice | 💗 핫핑크 |

#### 사용 예시

배지 하나만 쓸 때:
```json
"badges": ["original-article"]
```

배지 두 개를 함께 쓸 때 (논문 유형 + 카테고리):
```json
"badges": ["original-article", "resuscitation"]
```

에디터 픽 + 논문 유형:
```json
"badges": ["editor", "original-article"]
```

에디터 픽 + 논문 유형 + 카테고리:
```json
"badges": ["editor", "review", "imaging"]
```

---

### 3단계 — 웹진 발행 확인

`data.json` 저장 후 약 1~2분 뒤에 아래 주소에서 확인합니다.

```
https://ceem-webzine.github.io/ceem-webzine/
```

---

## 🗂️ 새 호 발간 시 이전 호를 Archive로 보관하는 방법

새 호를 올리기 **직전에** 아래 순서를 따라 이전 호를 archive에 저장합니다.

### 순서

**① 현재 `data.json` 내용을 복사합니다**
- GitHub에서 `data.json`을 열고 전체 내용을 복사합니다 (`Ctrl+A` → `Ctrl+C`)

**② `archives/` 폴더에 새 파일을 만듭니다**
- `archives/` 폴더 클릭 → `Add file` → `Create new file`
- 파일 이름을 `2025-01.json` 형식으로 입력합니다 (이전 호의 년도-호수, 예: 첫번째호 → `2025-01`, 12번째호 → `2025-12`)
- 복사한 내용을 붙여넣기 합니다
- **`Commit changes`** 를 눌러 저장합니다

**③ 그 다음 `data.json`을 새 호 내용으로 업데이트합니다**

> 이미지 파일은 `assets/images/`에 그대로 두면 됩니다. 이름 규칙을 지켜뒀기 때문에 archive JSON이 올바른 경로를 이미 가리키고 있습니다.

---

## 🔗 과거 호 열람 주소

과거 호는 아래와 같이 주소 끝에 `?issue=년도-호수` 를 붙이면 볼 수 있습니다.

```
https://ceem-webzine.github.io/ceem-webzine/?issue=2025-01
https://ceem-webzine.github.io/ceem-webzine/?issue=2025-02
```

> 호수 형식: `YYYY-NN` (예: 2025년 1번째호 → `2025-01`, 2025년 12번째호 → `2025-12`)

레이아웃은 최신호와 완전히 동일하게 표시됩니다.

---

## 📋 호수별 주소 목록 관리 (GitHub Wiki 활용)

매 호 주소를 체계적으로 기록하고 싶다면 **GitHub Wiki**를 활용하세요. 코딩 없이 텍스트로 목록을 관리할 수 있습니다.

### Wiki 시작하기

1. 저장소 상단 탭에서 **`Wiki`** 를 클릭합니다.
2. **`Create the first page`** 를 클릭합니다.
3. 아래 예시처럼 호수별 주소를 기록합니다.
4. **`Save page`** 를 눌러 저장합니다.

### Wiki 작성 예시

```
# CEEM Webzine Archive 목록

| 호수 | 발간일 | 주소 |
|------|--------|------|
| Vol.13 No.2 | 2026년 2월 XX일 | https://ceem-webzine.github.io/ceem-webzine/?issue=2026-02 |
| Vol.13 No.1 | 2026년 1월 XX일 | https://ceem-webzine.github.io/ceem-webzine/?issue=2026-01 |
| Vol.12 No.12 | 2025년 12월 XX일 | https://ceem-webzine.github.io/ceem-webzine/?issue=2025-12 |
| Vol.12 No.1 | 2025년 1월 XX일 | https://ceem-webzine.github.io/ceem-webzine/?issue=2025-01 |
```

> 새 호를 발간할 때마다 Wiki에 한 줄씩 추가해두면, 나중에 특정 호를 찾을 때 편리합니다.

---

## ✅ 매달 발간 체크리스트

새 호 발간 전 아래 순서대로 진행하세요.

- [ ] 이미지 파일 이름을 규칙에 맞게 지었는가? (`fig_년도호수_번호.png`)
- [ ] `assets/images/`에 이미지를 업로드했는가?
- [ ] 현재 `data.json`을 `archives/YYYY-MM.json`으로 복사해 저장했는가?
- [ ] `data.json`을 새 호 내용으로 업데이트했는가?
- [ ] 웹사이트에서 정상적으로 표시되는지 확인했는가?
- [ ] GitHub Wiki에 새 호 주소를 추가했는가?

---

## ❓ 문제가 생겼을 때

| 증상 | 원인 및 해결 |
|------|-------------|
| 웹진이 텅 비어 있음 | `data.json` 문법 오류. 쉼표(`,`)나 따옴표(`"`)가 빠진 곳이 있는지 확인 |
| 이미지가 안 보임 | `image` 경로가 실제 파일명과 다른지 확인 (대소문자 포함) |
| 과거 호 링크가 안 열림 | `archives/` 폴더에 해당 JSON 파일이 있는지 확인 |
| 수정 후 반영이 안 됨 | GitHub Pages 배포는 최대 2분 소요. 기다린 후 새로고침 |

---

Created by 허세진 | CEEM, 2026
