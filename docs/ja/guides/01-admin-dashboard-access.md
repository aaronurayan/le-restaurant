# 01. 管理者ダッシュボードアクセスガイド

![Documentation Status](https://img.shields.io/badge/documentation-complete-brightgreen)
![Language](https://img.shields.io/badge/language-Japanese-yellow)
![Guide Number](https://img.shields.io/badge/guide-01-blue)

## 📍 ルート
**URL**: `/admin/dashboard`

## 🔐 アクセス権限
- **ADMIN** ロール
- **MANAGER** ロール

その他のロール（CUSTOMER、未認証ユーザー）はこのルートにアクセスできず、`ProtectedRoute`によって自動的にリダイレクトされます。

## 🚀 アクセス方法

### 1. デスクトップナビゲーション（ヘッダー上部）
**場所**: ヘッダーの上部メニューバー
- Admin/Managerとしてログインしている場合、ヘッダーに**「Dashboard」**リンクが表示されます
- クリックして`/admin/dashboard`に移動

```
[Menu] [About] [Contact] [Dashboard] ← このセクション
```

### 2. ユーザードロップダウンメニュー（ヘッダー右側）
**場所**: ヘッダー右上のユーザーアイコンをクリック
- ユーザーアイコンをクリックしてドロップダウンメニューを開く
- **「Admin Dashboard」**リンクをクリック

```
[User Icon] クリック
  ↓
┌─────────────────────┐
│ Admin Dashboard     │ ← クリック
│ Menu Management     │
│ User Management     │
│ ...                 │
└─────────────────────┘
```

### 3. モバイルメニュー
**場所**: モバイル画面でハンバーガーメニュー（☰）をクリック
- モバイルの左上でハンバーガーメニューをクリック
- サイドバーの**「Admin Dashboard」**リンクをクリック

```
[☰] クリック
  ↓
┌─────────────────┐
│ Admin Dashboard │ ← クリック
│ Menu Management │
│ ...             │
└─────────────────┘
```

### 4. 直接URL入力
ブラウザのアドレスバーに直接入力：
```
http://localhost:5173/admin/dashboard
```

### 5. 他の管理者ページからの戻りナビゲーション
以下のページから「Back to Dashboard」ボタンをクリック：
- `/admin/menu` (メニュー管理)
- `/admin/reservations` (予約管理)
- `/admin/users` (ユーザー管理)
- `/delivery` (配送管理)
- `/payments` (支払い管理)

## 🔄 自動リダイレクト

### ログインしていない場合
- `/admin/dashboard`にアクセス → ログインページにリダイレクト

### 権限不足（CUSTOMERロール）
- `/admin/dashboard`にアクセス → ホーム（`/`）または顧客ダッシュボードにリダイレクト

## 📝 テストアカウント

以下のアカウントで管理者ダッシュボードにアクセスできます：

### 管理者アカウント
- **メール**: `admin@lerestaurant.com`
- **パスワード**: `password123`
- **ロール**: ADMIN

### マネージャーアカウント
- **メール**: `manager@lerestaurant.com`
- **パスワード**: `password123`
- **ロール**: MANAGER

## 🎯 ダッシュボード機能

管理者ダッシュボード（`/admin/dashboard`）から、以下にすばやくアクセスできます：

1. **予約管理** - 予約を管理
2. **注文** - 注文を表示
3. **メニュー管理** - メニュー項目を管理
4. **ユーザー** - ユーザーアカウントを管理
5. **支払い** - 支払いを管理
6. **配送管理** - 配送を追跡

## 💡 ヒント

- ダッシュボードには**統計情報**が表示されます：
  - 総収益
  - 保留中の注文
  - アクティブな予約
  - アクティブなユーザー

- 任意のクイックアクションカードをクリックして、対応する管理ページに移動できます。

---

**関連**: [ルーティング検証](./02-routing-verification.md) | [UXナビゲーション改善](./03-ux-navigation-improvements.md)

