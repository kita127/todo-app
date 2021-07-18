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

* express-generator
    * Express のプロジェクトを自動生成してくれるツール
    * グローバル環境にインストールする
        * $ npm install express-generator -g
* express-session
    * Express でセッションを扱うためのパッケージ
    * $ npm install --save express-session
* sqlite3
    * Node で SQLite3 を扱うためのパッケージ
    * $ npm install --save sqlite3

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
* priority
    * タスクの優先度
    * 1, 2, 3 の３段階
    * 1 が最高優先度で 3 が最低優先度


## 実行

1. `$ npm start` を実行しサーバを起動する
1. ブラウザのアドレスバーに `http://localhost:3000` を入力しアクセス

## express の使い方

テンプレートエンジンに `ejs` を指定した場合の使用方法

1. views フォルダの中に html のベースとなるテンプレートファイル(.ejs)を作成する
1. routes フォルダの中に `.js` ファイルを作成しそこにクライアントからアクセスがあった場合の制御を書く
    * router.get/routes.post で各 http メソッドの処理を定義する
    * テンプレートを使ったレンダリングもここで行う
        * `res.render('users' ,{...})` とすれば `users.ejs` をベースにレンダリングする
    * router.get/router.post の引数で指定するパスはその router モジュールをルートとした相対パスで指定する
        * ルートが `users` の場合に `/hoge` を引数に指定した場合は `http://localhost:3000/users/hoge` となる
1. app.js に以下のコードを追記する
    * `var xxxRouter = require('./routes/xxx');`
    * `app.use('/xxx', xxxRouter);`

### フォルダ構成

* routes フォルダ
    * ルーティングに関するスクリプトがまとめられている. このアドレスにアクセスしたらこの処理を実行するなど制御している
* views フォルダ
    * Web ページの元となるテンプレートをまとめる
    * ejs は HTML がベースとなる
* app.js
    * Web アプリの本体となるスクリプト
    * 外部パッケージの require
    * ルーティングの追加
    * etc
* node_modules
    * プロジェクトが依存するパッケージ群
    * `package.json` で管理されており、npm install でインストールできるためバージョン管理対象外でよい

## ユニットテスト

### 導入

Mocha というユニットテスト用のフレームワークを使用する

    # mocha をインストール
    $ npm install mocha --save-dev

    # プロジェクト直下の test ディレクトリ内にある .js ファイルを対象に mocha はテストするためフォルダを作成する
    $ mkdir test

    # テストモジュール作成
    $ touch ./test/test-sample.js

### テスト実行

    $ npx mocha


## sequelize

sequelize は Node.js 用の OR マッパー

### 導入

    $  npm install sequelize

### sequelize-cli の導入

sequelize を便利に使用するための CLI ツール

    $ npm install sequelize-cli

### DB 生成手順

#### 1. sequelize を初期化する

    $ npx sequelize-cli init

#### 2. 以下のフォルダが作成される

* config
    * 設定情報管理
* models
    * データベースアクセスに使う「モデル」というオブジェクトを定義する

#### 3. config.json に設定をする
``` json
{
  "development": {
    "database": "db-development",
    "dialect": "sqlite",
    "storage": "seq-todo.sqlite3"
  },
  "test": {
    "database": "db-test",
    "dialect": "sqlite",
    "storage": "seq-todo.sqlite3"
  },
  "production": {
    "database": "db-product",
    "dialect": "sqlite",
    "storage": "seq-todo.sqlite3"
  }
}
```

#### 4. モデルを作成する

    $ npx sequelize-cli model:generate --name users --attributes account:string,password:string,name:string,role:string

以下が生成される

* models/users.js
* migrations/yyyymmddxxxxxxxx-create-users.js

#### 5. マイグレーションを実行する

データベースの内容を変更した場合にその差分をデータベースに適用する.
今回は新たにモデルを作成したため、その変更をデータベースに反映する.
これによりモデルを作成した users テーブルが seq-todo.db に作成される.

    $ npx sequelize-cli db:migrate --env development

#### 6. シーディングによりレコードを作成する

シーディング作成用のスクリプトファイルを生成する

    $ npx sequelize-cli seed:generate --name sample-users

seeders/yyyymmddxxxxxxxx-sample-users.js が生成されているためその `up` に生成するレコードの情報を記述する.

``` javascript
up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
        {
            account: 'admin.com',
            password: 'admin',
            name: 'admin',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
},
```

シーディングを実行する

    $ npx sequelize-cli db:seed:all
