# Gallery Backend

A TypeScript Express.js backend for the Gallery application with ImageKit integration for direct client-side image uploads.

## Features

- 🚀 Express.js with TypeScript
- 📸 ImageKit integration for image uploads
- 🗄️ MongoDB database with Mongoose
- 🔐 Token-based authentication for ImageKit
- 🛡️ Security middleware (Helmet, CORS)
- 📊 Request logging with Morgan
- 🏥 Health check endpoint
- 🌐 Ready for Render.com deployment

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- ImageKit account

## Quick Start

```powershell
# Navigate to backend directory
cd "Gallery BE"

# Install dependencies
npm install

# Create environment file (copy from template)
copy env_template.txt .env
# Edit .env with your actual values

# Start development server
npm run dev
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/gallery-db

# ImageKit (get from imagekit.io dashboard)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. ImageKit Setup

1. Create an account at [ImageKit.io](https://imagekit.io)
2. Get your Public Key, Private Key, and URL Endpoint from the dashboard
3. Add these to your `.env` file

## Development

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## API Endpoints

### Events
- `GET /api/events` - List all events
- `GET /api/events/:eventId` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/:eventId` - Update event
- `DELETE /api/events/:eventId` - Delete event

### States
- `GET /api/states?eventId={eventId}` - List states for an event
- `GET /api/events/:eventId/states` - List states for an event (alternative)
- `POST /api/states` - Create new state
- `DELETE /api/states/:stateId` - Delete state

### Photos
- `GET /api/events/:eventId/states/:stateId/photos` - List photos for event/state
- `GET /api/photos` - List all photos (with optional filtering)
- `POST /api/photos` - Create new photo entry
- `DELETE /api/photos/:photoId` - Delete photo

### File Upload
- `POST /api/upload` - Upload single file to ImageKit
- `POST /api/upload/multiple` - Upload multiple files to ImageKit

### ImageKit Authentication
- `GET /api/imagekit/auth` - Generate authentication token for client-side uploads
- `GET /api/imagekit/config` - Get ImageKit configuration for frontend
- `POST /api/imagekit/webhook` - Webhook for upload notifications (optional)

### Health Check
- `GET /health` - Server health status

## Client-Side Integration

### Frontend Usage Example

```javascript
// Get ImageKit configuration
const configResponse = await fetch('http://localhost:5000/api/imagekit/config');
const config = await configResponse.json();

// Initialize ImageKit on frontend
const imagekit = new ImageKit({
  publicKey: config.data.publicKey,
  urlEndpoint: config.data.urlEndpoint,
  authenticationEndpoint: config.data.authenticationEndpoint
});

// Upload file
imagekit.upload({
  file: fileInput.files[0],
  fileName: "my-image.jpg",
  folder: "/gallery"
}).then(response => {
  console.log("Upload successful:", response);
}).catch(error => {
  console.log("Upload failed:", error);
});
```

## Deployment on Render.com

### Method 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your repository to Render
3. The `render.yaml` file will automatically configure the deployment

### Method 2: Manual Setup

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following:

**Build Settings:**
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

**Environment Variables:**
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `IMAGEKIT_PUBLIC_KEY`: Your ImageKit public key
- `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key
- `IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint
- `FRONTEND_URL`: Your frontend deployment URL

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a cluster
3. Create a database user
4. Get the connection string
5. Add it to your environment variables

## Security Features

- CORS configuration
- Helmet for security headers
- Request compression
- Input validation with Joi
- Environment variable validation
- Error handling middleware

## Project Structure

```
Gallery BE/
├── src/
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   └── imagekit.ts        # ImageKit configuration
│   ├── middleware/
│   │   ├── errorHandler.ts    # Global error handler
│   │   └── validation.ts      # Request validation
│   ├── models/
│   │   └── Image.ts          # Image metadata model
│   ├── routes/
│   │   └── imagekit.ts       # ImageKit routes
│   └── server.ts             # Main server file
├── dist/                     # Compiled JavaScript (generated)
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── render.yaml             # Render deployment config
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Troubleshooting

### Common Issues

1. **ImageKit authentication fails**
   - Check your API keys in `.env`
   - Ensure ImageKit URL endpoint is correct

2. **MongoDB connection issues**
   - Verify MongoDB is running locally
   - Check Atlas connection string and whitelist your IP

3. **CORS errors**
   - Update `FRONTEND_URL` in environment variables
   - Check CORS configuration in `server.ts`

## Support

For issues related to:
- ImageKit: [ImageKit Documentation](https://docs.imagekit.io/)
- MongoDB: [MongoDB Documentation](https://docs.mongodb.com/)
- Render: [Render Documentation](https://render.com/docs) 