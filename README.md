# 🎉 Express.js Skeleton with Socket.io, JWT, Google & Apple Auth, TypeORM, Swagger, and Image Storage 📦

This project is a starter template for an Express.js application with pre-configured integrations such as Socket.io, JWT authentication, Google and Apple OAuth, TypeORM for database interactions, Swagger for API documentation, and local image storage.

## 🚀 Features

- **Express.js**: Minimal and flexible Node.js web application framework.
- **Socket.io**: Real-time, bidirectional, and event-based communication.
- **JWT Authentication**: Secure your API with JSON Web Tokens.
- **Google & Apple OAuth**: Integrated authentication with Google and Apple.
- **TypeORM**: ORM for various databases.
- **Swagger**: Auto-generated API documentation.
- **Local Image Storage**: Configured for storing images locally.
- **Workflow**: Even a workflow is ready to deploy your api :)
## 📋 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm or yarn
- TypeScript

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/remicrobe/express-basic-skeleton.git
cd express-basic-skeleton.git
npm install
```

### Configuration

Create a `.env` file in the root of your project and configure the following environment variables:

```env
# API SETTINGS
PORT=5000
ENVIRONMENT=DEV
# IMPORTANT TO PUT ENVIRONMENT === 'BUILD' IN PRODUCTION !!!!!!

# Database Configuration
HOSTDB=
USERNAMEDB=
PASSWORDDB=
PORTDB=
NAMEDB=

# JWT Secret
JWT_SECRET=

# Local Image Storage
IMAGE_URL=localhost:5000/image/
STORAGE_FOLDER=H:\image-folder\
```

### Running the Application

For development, use:

```bash
npm run dev
```

This command uses `nodemon` and `ts-node` to automatically restart the server on file changes and run TypeScript files.

### Building the Application

To build the project for production:

```bash
npm run build
```

### Starting the Built Application

To start the built application:

```bash
npm start
```

### Generating Swagger Documentation

To generate Swagger documentation:

```bash
npm run swagger-autogen
```

## 📂 Project Structure

Here's a breakdown of the project architecture:

- **`database/`**: Contains database connection settings and TypeORM configurations.
- **`docs/`**: Swagger configuration and API documentation files.
- **`jobs/`**: Contains background jobs and scheduled tasks.
- **`middlewares/`**: Middleware functions for request processing.
- **`routes/`**: Route handlers for API endpoints.
- **`storage/`**: Configuration and handling for image storage.
- **`utils/`**: Utility functions and helpers.

## 🛠 Usage

### Authentication

This skeleton includes JWT authentication and OAuth with Google and Apple. Secure your endpoints with the provided authentication middleware.

### Real-Time Communication

Use Socket.io for real-time features like chat and notifications.

### Image Storage

Images are stored locally based on the `.env` file configuration. Ensure the storage folder path is correctly set.

## 🚀 GitHub Actions Workflow
You can use the provided GitHub Actions workflow to connect to your server via SSH and execute commands. This is useful for deploying your application or running remote commands automatically.

## 🤝 Contributing

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you'd like to change.
