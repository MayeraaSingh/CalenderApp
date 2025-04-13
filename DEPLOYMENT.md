# Deploying to Vercel

This guide will walk you through deploying your Calendar App to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [GitHub account](https://github.com/join) (recommended)
3. Your MongoDB Atlas cluster set up and running

## Preparation Steps

The application is already prepared for Vercel deployment with:

1. A `vercel.json` configuration file
2. Updated server code for serverless environment
3. Production environment variables

## Deployment Steps

### 1. Push Your Code to GitHub

If your code isn't already in a GitHub repository:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Create a new repository on GitHub and push your code
git remote add origin https://github.com/your-username/calendar-app.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Leave as "Other"
   - Root Directory: `./`
   - Build Command: `npm run vercel-build`
   - Output Directory: `build`
5. Expand "Environment Variables" section and add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
6. Click "Deploy"

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the CLI prompts to configure your project

### 3. Verify Your Deployment

1. After deployment, Vercel will provide a URL (e.g., `https://your-app.vercel.app`)
2. Visit the URL to confirm your frontend is working
3. Test the API endpoints by visiting `https://your-app.vercel.app/api`

### 4. Set Up Database

If you need to seed your production database:

1. Update your `.env` file with your production MongoDB URI
2. Run the seed command:
   ```bash
   npm run seed
   ```
3. Be careful with seeding production databases - only do this once during initial setup

## Troubleshooting

If you encounter issues:

1. **API Not Working**: Check Vercel logs in the dashboard
2. **CORS Issues**: Verify your CORS settings in `backend/server.js`
3. **Database Connection Errors**: Ensure your MongoDB Atlas network access allows connections from anywhere (or at least from Vercel's IPs)
4. **Build Errors**: Check the build logs in Vercel dashboard 