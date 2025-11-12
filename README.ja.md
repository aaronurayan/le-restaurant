# 🍽️ Le Restaurant

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=flat-square&logo=postgresql)
![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4?style=flat-square&logo=microsoft-azure)

[한국어](README.md) | [English](README.en.md) | 日本語 | [Русский](README.ru.md)

---

## 概要

**Spring Boot** バックエンドと **React + TypeScript** フロントエンドで構築されたモダンなフルスタックレストラン管理システム。UTSの高度ソフトウェア開発コースの一環として、5名のUTS学生が共同開発。注文管理、決済処理、配送追跡、テーブル予約などの包括的な機能を備えています。

**コアコンセプト**: Atomic Design原則に従った、スケーラブルで保守性の高いレストラン管理プラットフォーム。堅牢なAPI接続、ロールベースアクセス制御、顧客・スタッフ・マネージャー向けの包括的な機能カバレッジを提供します。

---

## 🚀 クイックスタート

### 🌐 ライブデプロイメント (Azure)

**アプリケーションはAzureで稼働中です！**

- **バックエンドAPI**: https://le-restaurant-adbrdddye6cbdjf2.australiaeast-01.azurewebsites.net
- **フロントエンド**: https://le-restaurant-frontend.azurestaticapps.net
- **データベース**: Azure上のPostgreSQL 14 (Australia East)
- **自動デプロイ**: Azure DevOpsパイプライン (`main`ブランチへのプッシュ)

### 💻 ローカル開発

#### 前提条件
- **Java 17+** (バックエンド用)
- **Node.js 18+** (フロントエンド用)
- **PostgreSQL 14+** (開発にはH2も使用可能)
- **Git** (バージョン管理用)

#### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/aaronurayan/le-restaurant.git
cd le-restaurant

# バックエンドを起動 (Spring Boot)
cd backend
./mvnw spring-boot:run
# バックエンドは http://localhost:8080 で実行されます

# 新しいターミナルで、フロントエンドを起動 (React + Vite)
cd frontend
npm install
npm run dev
# フロントエンドは http://localhost:5173 で実行されます
```

#### アクセスポイント
- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:8080
- **APIドキュメント**: http://localhost:8080/swagger-ui.html
- **ヘルスチェック**: http://localhost:8080/api/health

---

## 🏗️ アーキテクチャ

### コアコンポーネント

#### バックエンド (Spring Boot)
- **Controllers**: REST APIエンドポイント (`/api/*`)
- **Services**: ビジネスロジック層
- **Repositories**: データアクセス層 (Spring Data JPA)
- **Entities**: ドメインモデル (User, Order, MenuItem, Payment等)
- **DTOs**: API通信用データ転送オブジェクト
- **Config**: セキュリティ、CORS、アプリケーション設定

#### フロントエンド (React + TypeScript)
- **Atoms**: 基本UIコンポーネント (Button, Input, Badge等)
- **Molecules**: 複合コンポーネント (MenuCard, OrderCard等)
- **Organisms**: 複雑なUIセクション (MenuManagementPanel, OrderManagementPanel等)
- **Templates**: ページレイアウト (MainLayout)
- **Pages**: ルートコンポーネント
- **Hooks**: API操作用のカスタムReactフック
- **Services**: APIクライアントとサービス層
- **Contexts**: グローバル状態管理 (Auth, Cart)

### デザインパターン

- **Atomic Design**: コンポーネントアーキテクチャ (Atoms → Molecules → Organisms → Templates → Pages)
- **Singleton Pattern**: APIクライアントインスタンス
- **Repository Pattern**: データアクセス抽象化
- **Service Layer Pattern**: ビジネスロジック分離
- **DTO Pattern**: データ転送オブジェクト
- **Dependency Injection**: Spring IoCコンテナ
- **Custom Hooks**: 再利用可能なReactロジック

### パフォーマンス最適化

- **API Client**: リトライロジックとヘルスチェックを備えた統合クライアント
- **Mock Data Fallback**: バックエンドが利用不可の場合の優雅な劣化
- **Lazy Loading**: React Routerによるコード分割
- **Connection Pooling**: データベース接続管理
- **Caching**: メニューアイテムとユーザーデータの戦略的キャッシング
- **Optimistic Updates**: 即座のUIフィードバック

---

## 📁 プロジェクト構造

```
le-restaurant/
├── backend/                          # Spring Boot API
│   ├── src/main/java/
│   │   ├── controller/              # RESTコントローラー
│   │   ├── service/                  # ビジネスロジック
│   │   ├── repository/               # データアクセス
│   │   ├── entity/                   # ドメインモデル
│   │   ├── dto/                      # データ転送オブジェクト
│   │   └── config/                   # 設定
│   └── pom.xml
│
├── frontend/                         # React + TypeScriptアプリ
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/                # 基本UIコンポーネント
│   │   │   ├── molecules/            # 複合コンポーネント
│   │   │   ├── organisms/            # 複雑なUIセクション
│   │   │   └── templates/            # ページレイアウト
│   │   ├── pages/                    # ルートコンポーネント
│   │   ├── hooks/                    # カスタムReactフック
│   │   ├── services/                 # APIサービス
│   │   └── contexts/                # グローバル状態
│   └── package.json
│
└── docs/                             # ドキュメント
```

---

## 🎯 主要機能

### 👤 ユーザー管理 (F100-F102)
- **ユーザー登録**: メールベースのアカウント作成
- **認証**: セッション管理による安全なログイン
- **ユーザー管理**: ユーザーCRUD操作用マネージャーダッシュボード
- **ロールベースアクセス**: 顧客、スタッフ、マネージャーロール

### 🍽️ メニュー管理 (F103-F104)
- **メニュー表示**: カテゴリベースのメニューブラウジング
- **検索・フィルター**: リアルタイム検索とフィルタリング
- **メニュー管理**: メニューアイテムのCRUD操作
- **画像管理**: メニューアイテム画像アップロード

### 🛒 注文・決済 (F105-F106)
- **注文作成**: アイテム管理機能付きショッピングカート
- **注文追跡**: リアルタイム注文ステータス更新
- **決済処理**: 複数の決済方法
- **取引管理**: 決済履歴と調整

### 🚚 配送管理 (F107)
- **配送割り当て**: ドライバー割り当てシステム
- **ステータス追跡**: リアルタイム配送ステータス更新
- **住所管理**: 顧客配送住所
- **進捗更新**: 顧客通知

### 🍽️ テーブル予約 (F108-F109)
- **テーブル予約**: 日時ベースの予約
- **空き状況確認**: リアルタイムテーブル空き状況
- **予約管理**: マネージャー承認/拒否システム
- **顧客ダッシュボード**: 予約履歴とステータス

---

## 🛠️ 技術スタック

### バックエンド
- **Java 17** - プログラミング言語
- **Spring Boot 3.x** - アプリケーションフレームワーク
- **Spring Data JPA** - データ永続化
- **PostgreSQL 14** - 本番データベース
- **H2 Database** - 開発データベース
- **Maven** - 依存関係管理
- **Spring Security** - 認証・認可

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript 5.x** - 型安全なJavaScript
- **Vite 7.x** - ビルドツールと開発サーバー
- **Tailwind CSS 3.x** - ユーティリティファーストCSSフレームワーク
- **React Router DOM** - クライアントサイドルーティング
- **Axios** - HTTPクライアント
- **React Hook Form** - フォーム管理
- **Zustand** - 状態管理
- **Lucide React** - アイコンライブラリ

### DevOps & クラウド
- **Azure App Service** - バックエンドホスティング
- **Azure Static Web Apps** - フロントエンドホスティング
- **Azure PostgreSQL** - 本番データベース
- **Azure DevOps** - CI/CDパイプライン
- **Docker** - コンテナ化 (オプション)

---

## 👥 チーム協力

このプロジェクトは、**5名のUTS学生**が共同で開発しています：

| 機能 # | 名前 | 説明 | 担当者 |
|--------|------|------|--------|
| **F100** | ユーザー登録 | 顧客がメールとパスワードで新しいアカウントを作成できます。 | **Junayeed Halim** |
| **F101** | ユーザー認証 | 登録済み顧客がアカウントにログインできます。 | **Junayeed Halim** |
| **F102** | ユーザー管理 (マネージャー) | マネージャーが顧客アカウントを表示、編集、削除できます。 | **Jungwook Van** |
| **F103** | メニュー表示 | カテゴリ別に食品アイテムを表示。画像、価格、在庫状況を含む。 | **Mikhail Zhelnin** |
| **F104** | メニュー管理 (マネージャー) | メニューアイテム、価格、画像の作成、更新、削除、管理。 | **Mikhail Zhelnin** |
| **F105** | 注文管理 | 決済システムと注文確認を含む注文の作成と送信。 | **Damaq Zain** |
| **F106** | 決済管理 | 注文の顧客決済処理。取引処理を含む。 | **Jungwook Van** |
| **F107** | 配送管理 | 顧客配送の管理。配送担当者の割り当てと追跡を含む。 | **Aaron Urayan** |
| **F108** | テーブル予約 | 顧客が特定の日時、人数でテーブルを予約できます。 | **Damaq Zain** |
| **F109** | 予約管理 (マネージャー) | すべての顧客予約の表示、承認、拒否、管理。 | **Aaron Urayan** |

---

## 📚 ドキュメント

すべてのプロジェクトドキュメントは [`docs/`](docs/) ディレクトリに整理されています：

- **📖 ドキュメントインデックス**: [`docs/README.md`](docs/README.md)
- **🎨 フロントエンドドキュメント**: [`docs/frontend/`](docs/frontend/)
- **🏗️ 設計・アーキテクチャ**: [`docs/design/`](docs/design/)
- **🧪 テスト**: [`docs/testing/`](docs/testing/)
- **📋 要件**: [`docs/requirements/`](docs/requirements/)
- **🚀 デプロイメント**: [`docs/AZURE_DEPLOYMENT_GUIDE.md`](docs/AZURE_DEPLOYMENT_GUIDE.md)

---

## 🎓 学術プロジェクト

このプロジェクトは、シドニー工科大学（UTS）の**41029 高度ソフトウェア開発**コースの一環として、2025年春学期に開発されました。

### 👨‍🎓 チームメンバー
- **Junayeed Halim** - ユーザー登録・認証 (F100, F101)
- **Jungwook Van** - ユーザー管理・決済管理 (F102, F106)
- **Mikhail Zhelnin** - メニュー表示・管理 (F103, F104)
- **Damaq Zain** - 注文管理・テーブル予約 (F105, F108)
- **Aaron Urayan** - 配送管理・予約管理 (F107, F109)

### 🏫 大学情報
- **コース**: 41029 高度ソフトウェア開発
- **機関**: シドニー工科大学 (UTS)
- **学期**: 2025年春
- **プロジェクトタイプ**: 共同グループ課題

**注意**: これはUTS学生が開発した学術プロジェクトであり、商業目的には使用されません。

---

## 📄 ライセンス

このプロジェクトは、UTS高度ソフトウェア開発コースの一環として、学術目的で開発されています。

---

**最終更新**: 2025-01-27

