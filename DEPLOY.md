# 部署到 GitHub Pages

這份文件是給 Claude Code（或自己動手）把「九宮問事」放上 GitHub Pages 的步驟。完成後會得到一個公開網址，朋友點開就能用，不需要任何帳號。

## 給 Claude Code 的指示

> 請把這個資料夾（qimen-app）建立成一個新的 GitHub repository，名稱 `qimen`，設為 Public，並用 GitHub Pages 從 `main` 分支的根目錄發佈。完成後告訴我網址，並用瀏覽器打開確認頁面能正常起盤。

## 步驟

### 1. 前置確認

- 已安裝 `git` 與 GitHub CLI `gh`，並已登入：`gh auth status`。
- 資料夾根目錄要有 `index.html`。GitHub Pages 會把它當首頁。

### 2. 建立 repository 並推送

```bash
cd qimen-app
git init -b main
git add .
git commit -m "九宮問事：初版"
gh repo create qimen --public --source=. --push --description "九宮問事：奇門遁甲排盤與白話解讀（時家奇門・轉盤・拆補法）"
```

### 3. 開啟 GitHub Pages

```bash
gh api -X POST repos/{owner}/qimen/pages -f "source[branch]=main" -f "source[path]=/"
```

`{owner}` 換成 GitHub 帳號名稱。若出現「already exists」，代表已經開啟過，可略過。

也可以在網頁上設定：repository 的 **Settings → Pages → Build and deployment**，Source 選 **Deploy from a branch**，Branch 選 `main` 與 `/ (root)`，按 **Save**。

### 4. 取得網址

```bash
gh api repos/{owner}/qimen/pages --jq .html_url
```

網址格式為 `https://{owner}.github.io/qimen/`。第一次發佈約需 1–3 分鐘才會生效。

### 5. 驗證

1. 用瀏覽器打開網址，確認頁面出現九宮盤與解讀。
2. 按「用現在時間起盤」，確認會更新。
3. 用手機打開，確認版面正常。也可以在手機瀏覽器選「加入主畫面」。

## 之後更新

在 `src/` 改完內容後：

```bash
cd src && node build.js && cd ..
git add . && git commit -m "更新說明" && git push
```

推送後約 1 分鐘，網站就會自動更新。

## 選用：加到系統入口網站

如果已有個人的系統入口網站，可以新增一筆：

- **名稱**：九宮問事
- **網址**：`https://{owner}.github.io/qimen/`
- **說明**：奇門遁甲排盤（時家奇門・轉盤・拆補法），可依問事類別產生白話解讀，並複製給親友。
- **類別**：個人工具（非學校公務）

## 注意事項

- 這是公開網站，任何拿到網址的人都能使用。工具本身不收集資料，紀錄只存在各自的瀏覽器裡。
- repository 也會是公開的，原始碼看得到。若不希望公開原始碼：
  - 付費的 GitHub 方案可以用 Private repository 搭配 Pages；
  - 或改用其他免費靜態網站服務，例如 Cloudflare Pages、Netlify，直接上傳 `index.html` 即可。
