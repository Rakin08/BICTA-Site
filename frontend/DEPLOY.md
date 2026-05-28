# BICTA Website - Complete Deployment Guide
## For Non-Technical Users - Follow Every Step Exactly

---

## PART 1: Create Your Sanity CMS Project (Content Management)

Sanity is where you will add/edit all your website content (events, programs, advisers, etc.).

### Step 1: Create Sanity Account
1. Open your browser and go to: **https://www.sanity.io/manage**
2. Click **"Sign Up"** (use your Google account or email)
3. Complete the registration

### Step 2: Create New Project
1. On the Sanity dashboard, click the big **"+ Create new project"** button
2. Enter project name: **BICTA Website**
3. Click **"Create project"**
4. Your project is created! You will see a screen with your **Project ID**

### Step 3: Get Your Project ID
1. Look at the URL or the project card - you will see a random string like `abc123de`
2. **WRITE THIS DOWN** - This is your `NEXT_PUBLIC_SANITY_PROJECT_ID`
3. Also find your **Dataset name** (usually "production" by default)

### Step 4: Create API Token
1. In your Sanity project dashboard, click **"API"** in the left sidebar
2. Click **"Tokens"** tab
3. Click **"+ Add API token"**
4. Name it: `bicta-production-token`
5. Set Permissions to: **"Editor"** (or "Administrator")
6. Click **"Save"**
7. A token will appear - **COPY AND SAVE IT IMMEDIATELY** (you can't see it again!)
8. This is your `SANITY_API_TOKEN`

### Step 5: Enable CORS Origins
1. Still in the **"API"** section, click **"CORS origins"** tab
2. Click **"+ Add CORS origin"**
3. Enter: `http://localhost:3000` (for local development)
4. Click **"Save"**
5. Add another: `https://*.vercel.app` (for Vercel preview deployments)
6. Click **"Save"**
7. Add your final domain later (e.g., `https://bicta.org`)

---

## PART 2: Deploy to Vercel (Your Website Hosting)

Vercel is where your website will be hosted and made accessible on the internet.

### Step 6: Create Vercel Account
1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"** (recommended)
3. If you don't have GitHub, create one first at https://github.com/signup
4. Complete the signup process

### Step 7: Install Vercel CLI (One-time setup)
1. On your computer, you need Node.js installed
2. Go to https://nodejs.org and download the LTS version
3. Install it (just keep clicking Next)
4. Open your computer's terminal/command prompt:
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `terminal`, press Enter
5. Type this command and press Enter:
   ```
   npm i -g vercel
   ```
6. Wait for it to finish

### Step 8: Deploy Your Project
1. Extract the `bicta-deploy.zip` file I gave you to a folder (e.g., `Desktop/bicta-website`)
2. Open terminal/command prompt
3. Navigate to the folder:
   ```
   cd Desktop/bicta-website
   ```
   (Replace `Desktop/bicta-website` with wherever you extracted it)
4. Log in to Vercel:
   ```
   vercel login
   ```
   - Press Enter to open browser
   - Click "Continue" in the browser
   - Go back to terminal
5. Deploy:
   ```
   vercel --prod
   ```
6. Answer the questions:
   - Set up and deploy? **Y**
   - Which scope? Press Enter (your personal account)
   - Link to existing project? **N**
   - What's your project name? **bicta-website**
7. Wait for deployment (2-5 minutes)
8. You will get a URL like: `https://bicta-website.vercel.app`

---

## PART 3: Set Environment Variables

These tell your website how to connect to Sanity.

### Step 9: Add Environment Variables in Vercel
1. Go to https://vercel.com/dashboard
2. Click on your **bicta-website** project
3. Click **"Settings"** tab at the top
4. Click **"Environment Variables"** in the left sidebar
5. Add each variable one by one:

| Name | Value | Where to find |
|------|-------|---------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Project ID | From Step 3 |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Default dataset name |
| `SANITY_API_TOKEN` | Your API Token | From Step 4 |
| `SANITY_REVALIDATE_SECRET` | `bicta_webhook_secret_2024` | You can make up any random string |

6. For each variable:
   - Paste the Name in the "Name" field
   - Paste the Value in the "Value" field
   - Select **Production**, **Preview**, AND **Development** environments (all 3 checkboxes)
   - Click **"Save"**

### Step 10: Redeploy
1. After adding all environment variables, go back to your project
2. Click **"Deployments"** tab
3. Click the three dots (...) on the latest deployment
4. Click **"Redeploy"**
5. Click **"Redeploy"** again to confirm
6. Wait 2-3 minutes

---

## PART 4: Access Sanity Studio to Add Content

### Step 11: Launch Sanity Studio Locally
1. Open terminal/command prompt
2. Go to your project folder:
   ```
   cd Desktop/bicta-website
   ```
3. Create a file called `.env.local` with this content (replace the values):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token_here
   ```
4. Run the studio:
   ```
   cd studio
   npm install
   npx sanity dev
   ```
5. Open http://localhost:3333 in your browser
6. You can now add/edit all content!

### Step 12: Initial Content to Add
In Sanity Studio, create these documents:

#### Site Settings (1 document)
- **Type**: Site Settings
- Site Title: "BICTA - Bangladesh ICT Alliance"
- Tagline: "Bridging Academia and Industry"
- Contact Email: your email
- Social Links: Add your social media URLs

#### Founders (add 1-3)
- **Type**: Founder
- Name, Role, Bio, Photo

#### Advisors (add several)
- **Type**: Advisor  
- Name, Title, Organization, Category (Industry/Academia/Government), Bio, Photo

#### Partners/Supporters (add several)
- **Type**: Partner
- Name, Logo, Tier (Platinum/Gold/Silver), Website URL

#### About Page Content (1 document)
- **Type**: About Page
- Mission statement, Vision, History, Team info

#### Programs (add your 3 main programs)
- **Type**: Program
- AI Olympiad, AI for SDG, Datathon Series with descriptions

---

## PART 5: Connect Your Domain (Optional)

If you own `bicta.org` or another domain:

1. In Vercel, go to your project
2. Click **"Settings"** → **"Domains"**
3. Enter your domain (e.g., `bicta.org`)
4. Click **"Add"**
5. Follow Vercel's DNS instructions to point your domain
6. Add your domain to Sanity CORS origins (Step 5)

---

## PART 6: Update Your Website

Whenever you want to update content:
1. Go to Sanity Studio (http://localhost:3333 or deploy it)
2. Edit/add content
3. Changes appear automatically on your website within 1 hour
4. For instant updates, go to Vercel and click "Redeploy"

---

## NEED HELP?

If you get stuck on any step:
1. Take a screenshot of the error
2. Share it with me and I'll guide you through it
3. You can also email Vercel support or Sanity support

**Your Website Stack:**
- Frontend: Next.js on Vercel
- Content: Sanity CMS
- Database: MySQL on Railway (for competitions later)
- Domain: Vercel (or your custom domain)
