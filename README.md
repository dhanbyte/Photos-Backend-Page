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

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your actual values

# Start development server
npm run dev
```

## Environment Configuration

Create `.env` file with:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/gallery-db

# ImageKit (get from imagekit.io dashboard)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret (auto-generated on Render)
JWT_SECRET=your_jwt_secret
```

## Development Commands

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

## Build and Deployment Commands

### For Local Development
```bash
npm run build
npm start
```

### For Render.com Deployment
**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
node dist/server.js
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

## Render.com Deployment Setup

### Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your repository to Render
3. The `render.yaml` file will automatically configure the deployment

### Manual Configuration
If not using render.yaml, configure these settings in Render:

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node dist/server.js`

**Environment Variables:**
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will provide this)
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `IMAGEKIT_PUBLIC_KEY`: Your ImageKit public key
- `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key
- `IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint
- `FRONTEND_URL`: Your frontend deployment URL
- `JWT_SECRET`: Auto-generated secret for JWT tokens

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a cluster
3. Create a database user
4. Get the connection string
5. Add it to your environment variables

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Ensure all imports use `.js` extensions in compiled code
   - Check that `dist/` folder is generated after build

2. **Port already in use**
   - Use a different port: `PORT=5002 npm start`

3. **ImageKit authentication fails**
   - Check your API keys in `.env`
   - Ensure ImageKit URL endpoint is correct

4. **MongoDB connection issues**
   - Verify MongoDB is running locally
   - Check Atlas connection string and whitelist your IP

5. **CORS errors**
   - Update `FRONTEND_URL` in environment variables
   - Check CORS configuration in `server.ts`

## Project Structure

```
Gallery Backend/
├── src/
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   └── imagekit.ts      # ImageKit configuration
│   ├── middleware/
│   │   ├── auth.ts           # Authentication middleware
│   │   ├── errorHandler.ts   # Global error handler
│   │   └── validation.ts     # Request validation
│   ├── models/
│   │   ├── Admin.ts         # Admin user model
│   │   ├── Event.ts         # Event model
│   │   ├── Image.ts         # Image metadata model
│   │   ├── Photo.ts         # Photo model
│   │   └── State.ts         # State model
│   ├── routes/
│   │   ├── auth.ts          # Authentication routes
│   │   ├── events.ts        # Event management
│   │   ├── imagekit.ts      # ImageKit integration
│   │   ├── photos.ts        # Photo management
│   │   ├── states.ts        # State management
│   │   └── upload.ts        # File upload handling
│   ├── scripts/
│   │   └── createAdmin.ts    # Admin creation script
│   └── server.ts             # Main server file
├── dist/                     # Compiled JavaScript (generated)
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── render.yaml              # Render deployment config
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server from compiled code |
| `npm run type-check` | Check TypeScript types without compilation |
| `npm run create-admin` | Create admin user (development) |

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/gallery` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public API key | `public_key_xyz` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key | `private_key_xyz` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | `https://ik.imagekit.io/your_id` |
| `FRONTEND_URL` | Frontend application URL | `https://your-app.vercel.app` |
| `JWT_SECRET` | JWT signing secret | Auto-generated on Render |
| `PORT` | Server port | `5001` (development) or `10000` (Render) |

## Support

For issues related to:
- ImageKit: [ImageKit Documentation](https://docs.imagekit.io/)
- MongoDB: [MongoDB Documentation](https://docs.mongodb.com/)
- Render: [Render Documentation](https://render.com/docs)
- TypeScript: [TypeScript Documentation](https://www.typescriptlang.org/docs/)