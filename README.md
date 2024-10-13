# Inventory Management Backend - Challange DOT Indonesia Backend Internship (Typescript)

## Deskripsi

Solusi sederhana dan efisien untuk mengelola inventori produk dalam bisnis.

## Teknologi yang Digunakan

- **TypeScript**
- **Node.js**
- **PostgreSQL**
- **NestJS**
- **TypeOrm**

## Project Pattern

Pattern yang dipilih untuk proyek ini adalah **MVC (Model, View, Controller)** yang dipadukan dengan **Domain Driven Design** (DDD). Pendekatan ini mendukung pemisahan tanggung jawab antar lapisan dan modul, sehingga memudahkan pengembangan, pemeliharaan, dan pengujian aplikasi.

## How To Run

- Setup .env file, put on root

```
DB_HOST=/db host/
DB_PORT=/db port/
DB_USER=/db user/
DB_PASS=/db pass/

JWT_SECRET= /jwt secret key/
```

- npm i
- run in watch mode => npm run start:dev
- build => npm run build

## Technical Requirement

- Terdiri dari minimal 2 operasi crud yang saling berkaitan.

```
1. Terdapat operasi crud pada tabel user yang berelasi dengan tabel store dengan konfigurasi "CASCADE" dengan relasi one-to-many
2. Terdapat operasi crud pada tabel store dengan tabel category dan product dengan konfigurasi "CASCADE" dengan relasi :
store - product => one-to-many
store - category => one-to-many
3. Terdapat operasi crud pada tabel product dan category dengan relasi many-to-many dengan tabel product_categories sebagai join tabel
```

- Menyimpan data menggunakan database Sql atau NoSql.

```
Data disimpan di Database PostgreSQL (Sql)
```

- Authentication api menggunakan JWT token.

```
Semua endpoint kecuali pada module Auth sudah diproteksi dengan guard sebagai validasi JWT token
```

- Buatkan fitur e2e testing untuk test token apinya.

```
test/auth.e2e-spec.ts
terdapat 4 test  yang berhubungan dengan test token

1. Hit endpoint /users tanpa menggunakan Bearer token - return 401
2. Hit endpoint /login menggunakan credential yang terdaftar - return 200
3. Hit endpoint /login menggunakan credential yang terdaftar - return JWT token
4. Hit endpoint /users menggunakan Bearer token - return 200
```
