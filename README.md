# 🃏 카드뒤집기 웹게임 프로젝트 PairZ

## https://pairz.vercel.app/

node -v 16.19.0

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fcodestates-beb%2FBEB-06-Ad4U&count_bg=%235CA227&title_bg=%23555555&icon=github.svg&icon_color=%23FFFFFF&title=PairZ+Hits+&edge_flat=false)](https://github.com/yiminwook/pairz)<br />

<br />

<br />

## 📑 Page Detail

<br />

<details>
<summary>Home Page</summary>
<div>
<img src=".github/home_page.gif" alt="home_page_gif">
<div>
</details>

<br />

<details>
<summary>Game page</summary>

<div>
<img src=".github/game_page.gif" alt="game_page_gif">
<div>

1. 데이터베이스에서 무작위로 겹치지 않는 무작위 카드를 5장을 뽑는다
2. 총 10장의 카드로 2개씩 짝을 맞추는 라운드가 시작(카드 로딩중에는 시간이 멈춤)
3. 시간제한이 있고 라이프가 3개가 주어지며 소모시 게임이 종료
4. 카드는 5초간 확인가능하고 이후 자동으로 뒤집어짐
5. 게임중 총 3번의 pause가 가능
6. 게임오버시 스코어를 기록가능 (회원가입 필요)
</details>

<br />

<details>
<summary>Showcase page</summary>

<div>
<img src=".github/showcase_page.gif" alt="showcase_page_gif">
<div>

1. 전체 이미지를 최신순으로 조회
2. 이미지 타이틀로 검색
3. 모든 검색은 5개씩 조회되고 더보기 버튼으로 페이지네이션이 가능
4. 처음 5개의 이미지는 staticProps로 받아 30초마다 static page 생성 (ISR적용)
</details>

<br />

<details>
<summary>Score page</summary>

<div>
<img src=".github/score_page.gif" alt="score_page_gif">
<div>

1. 전체 스코어를 score기준 내림차순으로 조회 / score가 같을시 최신순으로 내림차순 정렬
2. 10개씩 pagenation 가능
3. 처음 10개의 기록을 staticProps로 받아 30초마다 static page 생성 (ISR적용)
</details>

<br />

<details>
<summary>Upload page</summary>

<div>
<img src=".github/upload_page.gif" alt="upload_page_gif">
<div>

1. Drag and Drop으로 이미지 업로드 가능
2. 업로드시 사이즈 조정(크롭)이 가능
3. 이미지 타이틀를 임의로 지정할 수 있으며, 중복체크 가능
4. 서버 업로드전, 미리보기를 통해 카드에 적용시켜 확인 가능
</details>

<br />

<details>
<summary>Timeout page</summary>

1. idToken이 만료 또는 유효하지 않을경우 서버로부터 리다이렉션 되는 페이지
2. 접근시 강제로 로그아웃
</details>

---

<br />

## 📦 Stack

```
"next": "13.2.3",
"typescript": "4.9.5"
"sass": "^1.58.3",
"recoil": "^0.7.7",
"axios": "^1.3.4",
"firebase": "^9.17.2",
"firebase-admin": "^11.5.0",
"@aws-sdk/client-s3": "^3.289.0",
"react-cropper": "^2.3.1",
```

---

<br />

## 🧭 API

<br />

<details>
<summary>Member</summary>

```
회원가입/회원정보갱신
POST /api/member.add
headers: { authoriztion: "Bearer $idToken"; }
body: {
  uid: string;
  email?: string | null;
  emailId?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}
response: {
  result: boolean;
  message: string;
}

이미 등록된 사용자일 경우 body data를 통해 회원정보 갱신
```

</details>

<br />

<details>
<summary>Image</summary>

```
이미지 업로드
POST /api/image.add
headers: { authoriztion: "Bearer $idToken"; }
body/formData {
  image: File;
  imageName: string;
  imageType: "image/png" | "image/jpeg";
  uid: "string";
}
response: {
  result: boolean;
  imageName: string;
  message: string;
}
```

```
이미지검색(최신순)
GET /api/image.get
query: {
  idx?: string;
}
response: {
  imageData: ImageInfo[];
  lastIdx: number;
}

idx가 있을시 해당 idx이후 이미지를 최신순으로 가져옴(페이지네이션)
```

```
랜덤 이미지검색
GET /api/image.random
response: {
  imageData: ImageInfo[];
}

겹치지 않는 이미지 5장을 가져온다.
*총 DB 이미지가 5장이하일 경우에는 서버에러발생
```

```
이미지검색(타이틀/imageName)
GET /api/image.find
query)
name: string;
next?: "true" | "false"
response)
{
  imageData: ImageInfo[];
  lastName: string | null;
  lastIdx: number;
}

imageName으로 업로드한 이미지 검색, imageName순으로 정렬
next가 "true"일시 name의 다음 이미지 5장을 가지고 옴(페이지네이션)
```

```
이미지 타이틀(imageName) 중복체크
GET /api/image.check
query: {
  name: string;
}
response: {
  result: boolean;
}

DB에 접근하여 해당 name의 이미지가 있는 지 확인, 중복일시 false을 반환
```

</details>

<br />

<details>
<summary>Score</summary>

```
스코어 점수 기록
POST /api/score.add
headers: { authoriztion: "Bearer $idToken"; }
body: {
  uid: string;
  score: number;
  displayName: string;
}
response: {
  result: boolean;
}
```

```
스코어 랭킹 검색
GET /api/score.get
query: {
  idx?: string;
}
response: {
  scoreData: PasedScoreInfo[];
  lastIdx: number;
}

score id순으로 내림차순 10개 조회
idx가 있을시 해당 idx이후 스코어를 최신순으로 가져옴(페이지네이션)
```

</details>

---

<br />

## ⚙️ env

```
PROTOCOL=
HOST=
PORT=
LOCAL_TIME=32400000

/* S3 bucket */
AWS_S3_ACCESSKEY_Id=
AWS_S3_SECRET_ACCESS_KEY=
AWS_S3_REGION=
AWS_S3_BUCKET=

/* Firebase client */
FIREBASE_PROJECT_ID=
FIREBASE_AUTH_API_KEY=
FIREBASE_AUTH_AUTH_DOMAIN=

/* Firebase Admin */
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

/* Vercel temp Path */
IMAGE_STORAGE_PATH=/tmp
```

---
