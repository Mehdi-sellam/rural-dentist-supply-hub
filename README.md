# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/44513973-80d4-47ad-af0b-72c980249b28

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/44513973-80d4-47ad-af0b-72c980249b28) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend)

## How can I deploy this project?

### Option 1: Deploy to Vercel (Recommended)

1. **Fork or push your code to GitHub** (if not already done)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables:**
   Add these environment variables in Vercel:
   ```
   VITE_SUPABASE_URL=https://pmjrssmcyuyjxpvojmfk.supabase.co
   VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtanJzc21jeXV5anhwdm9qbWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTAzNjksImV4cCI6MjA2NTA2NjM2OX0.5Op3LafYuybBnHZUb
   ```

4. **Deploy:**
   - Vercel will automatically detect it's a Vite project
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

5. **Custom Domain (Optional):**
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain

### Option 2: Deploy with Lovable

Simply open [Lovable](https://lovable.dev/projects/44513973-80d4-47ad-af0b-72c980249b28) and click on Share -> Publish.

## Environment Variables

For local development, create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://pmjrssmcyuyjxpvojmfk.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtanJzc21jeXV5anhwdm9qbWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTAzNjksImV4cCI6MjA2NTA2NjM2OX0.5Op3LafYuybBnHZUb
```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
