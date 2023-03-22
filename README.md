node -v 16.19.0

카드뒤집기 게임 프로젝트 PairZ

<br />

> 페이지별 주요기능

게임 페이지

1. 데이터베이스에서 무작위로 겹치지 않는 무작위 카드를 5장을 뽑는다
2. 총 10장의 카드로 2개씩 짝을 맞추는 라운드가 시작(카드 로딩중에는 시간이 멈춤)
3. 시간제한이 있고 라이프가 3개가 주어지며 소모시 게임이 종료
4. 카드는 5초간 확인가능하고 이후 자동으로 뒤집어짐
5. 게임중 총 3번의 pause가 가능
6. 게임오버시 스코어를 기록 (회원가입 필요)

이미지 페이지

1. 전체 이미지를 최신순으로 조회
2. 이메일 작성자로 검색
3. 이미지 타이틀로 검색
4. 모든 검색은 5개씩 조회되고 더보기 버튼으로 페이지네이션이 가능

업로드 페이지

1. 로그인시에만 접근이 가능
2. Drag and Drop으로 이미지 업로드 가능
3. 업로드시 사이즈 조정(크롭)이 가능
4. 이미지 타이틀를 임의로 지정할 수 있으며, 중복 될 수 없음

마이페이지

1. 도메인을 통해 누구나 접속가능
2. 해당유저의 최대 스코어, 업로드 이미지를 볼 수 있음

---

<br />

> API

```
GET /api/auth
sessionCookie 유효성검증

GET /api/auth/signout
sessionCookie를 만료시켜 브라우저에서 삭제
```

```
GET /api/member.get
멤버조회(관리자 전용)
query)
email?: string;
이메일이 없을시 최신순으로 가져옴
```

```
POST /api/member.add
회원가입/회원정보갱신/sessionCookie 발급(24시간 유효)
headers) authoriztion: "Bearer idToken";
body)
uid: string;
email?: string | null;
emailId?: string | null;
displayName?: string | null;
photoURL?: string | null;

헤더로 firebase Token을 전송받음
```

```
POST /api/image.add
이미지 업로드
formData)
image: File;
imageName: string;
imageType: "image/png" | "image/jpeg";
```

```
GET /api/image.get
query) 각 query는 하나씩만 사용가능
random?: "true";
idx?: string;
imageName?: string;

random=true 일시 중복되지않는 이미지 5장을 가져옴
idx가 있을시 해당 idx이후 이미지를 최신순으로 가져옴
imageName이 있을시 이미지 타이틀 중복체크
random, idx, imageName이 모두 없을시 최신순으로 가져옴
```

```
POST /api/image.find
query)
imageName?: string;
email?: string;
idx?: string;

이미지 타이틀 또는 이메일로 업로드한 이미지 검색
idx가 있을시 페이지네이션이 가능

```

---

<br />

> env

```
PROTOCOL=
HOST=
PORT=

AWS_S3_ACCESSKEY_Id=
AWS_S3_SECRET_ACCESS_KEY=
AWS_S3_REGION=
AWS_S3_BUCKET=

FIREBASE_PROJECT_ID=
FIREBASE_AUTH_API_KEY=
FIREBASE_AUTH_AUTH_DOMAIN=

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

IMAGE_STORAGE_PATH=/tmp
```

---

<br />

> 사용스택

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
