🚗 Sell My Ride — Backend API
A full-featured backend for a car listing platform, built with NestJS. This project supports user authentication (including Google login), secure media uploads to AWS S3, PostgreSQL integration via TypeORM, and complete API documentation with Swagger.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=flat&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D.svg?style=flat&logo=swagger&logoColor=black)
![AWS S3](https://img.shields.io/badge/AWS_S3-232F3E.svg?style=flat&logo=amazon-aws&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google%20OAuth-4285F4?style=flat&logo=google&logoColor=white)


## 🌐 Live Swagger Docs

📖 [`http://localhost:3000/api`](http://localhost:3000/api)



## 🧰 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL + TypeORM
- **Auth**: JWT + Google OAuth2
- **File Uploads**: AWS S3 via `aws-sdk`
- **Docs**: Swagger UI (OpenAPI 3)



## 🛡️ User Roles & Permissions

| Role   | Permissions |
|--------|-------------|
| **Admin**  | Full access: manage users, listings, system settings |
| **Dealer** | Create and manage their own listings |
| **User**   | Browse listings, contact sellers |

All role-based access is enforced with NestJS guards and decorators.



📦 Features

🔐 Secure JWT-based authentication with access & refresh tokens

🆔 Google OAuth login integration

🗃️ PostgreSQL database with auto-sync and autoload

☁️ AWS S3 image uploads (vehicle photos, profile images)

📜 Swagger UI for interactive API exploration

🧱 Modular architecture following NestJS best practices


🛠️ Environment Variables

    # General
    API_VERSION=0.1.1
    
    # Database
    DATABASE_PORT=5432
    DATABASE_USER=postgres
    DATABASE_PASSWORD=1919
    DATABASE_HOST=localhost
    DATABASE_NAME=sell-my-ride-test
    DATABASE_SYNC=true
    DATABASE_AUTOLOAD=true
    
    # JWT Configuration
    JWT_SECRET=your-secure-secret-key
    JWT_TOKEN_AUDIENCE=localhost:3000
    JWT_TOKEN_ISSUER=localhost:3000
    JWT_ACCESS_TOKEN_TTL=3600
    JWT_REFRESH_TOKEN_TTL=86400
    
    # AWS S3
    AWS_ACCESS_KEY_ID=your-access-key
    AWS_SECRET_ACCESS_KEY=your-secret-key
    AWS_REGION=us-east-1
    AWS_BUCKET_NAME=sell-my-ride-bucket
    
    # Google OAuth2
    GOOGLE_CLIENT_ID=your-client-id
    GOOGLE_CLIENT_SECRET=your-client-secret

🚀 Getting Started

Clone & install

    git clone https://github.com/Null-logic-0/sell-my-ride-backend.git
    cd sell-my-ride-backend
    npm install

Create your .env file

Set up all values as shown above.

Run locally

    npm run start:dev


     





