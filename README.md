# todo-app

TODO 管理アプリ

書籍「作りながら学ぶWebプログラミング実践入門」の Chapter7 を作成したリポジトリ

https://book.mynavi.jp/ec/products/detail/id=112778


## 使用技術

* HTML
* CSS
* JavaScript
* Node.js
    * バックエンド
* Express
    * Node.js で Web アプリを開発するためのフレームワーク
* SQLite3
    * データベース

## 使用 Node パッケージ

* express-session
    * Express でセッションを扱うためのパッケージ
* sqlite3
    * Node で SQLite3 を扱うためのパッケージ


## データベース設計

### 利用者テーブル

* id
    * プライマリーキー
* account
    * アカウント名. メールアドレス等
* password
    * パスワード
* name
    * 名前
* role
    * 一般利用者(user)か管理者(admin)かを区別する

### ToDo テーブル

* id
    * プライマリーキー
* user_id
    * ToDo を作成した利用者の id
* title
    * ToDo のタイトル
* memo
    * ToDo の内容
* posted
    * 投稿した日時
* finished
    * 終了する日時
* checked
    * 既に完了した ToDo かどうかを表す


## 実行

1. `$ npm start` を実行しサーバを起動する
1. ブラウザのアドレスバーに `http://localhost:3000` を入力しアクセス
