# 🚀 How to Add Environment Variables to Netlify

## Method 1: Netlify Dashboard (Recommended)

### Step 1: Access Your Site Settings
1. **Log in to Netlify**: Go to [netlify.com](https://netlify.com) and sign in
2. **Select Your Site**: Click on your deployed site from the dashboard
3. **Go to Site Settings**: Click "Site settings" button

### Step 2: Navigate to Environment Variables
1. **Find Build & Deploy**: In the left sidebar, click "Build & deploy"
2. **Environment Variables**: Scroll down to find "Environment variables" section
3. **Click "Edit Variables"**: This opens the environment variables editor

### Step 3: Add Your Environment Variables
Add these variables one by one:

#### For Eleven Labs Voice Features:
- **Key**: `VITE_ELEVENLABS_API_KEY`
- **Value**: Your Eleven Labs API key (get from [elevenlabs.io](https://elevenlabs.io))

#### For Gemini AI Features:
- **Key**: `VITE_GEMINI_API_KEY`
- **Value**: Your Google Gemini API key

#### For Supabase (if using):
- **Key**: `VITE_SUPABASE_URL`
- **Value**: Your Supabase project URL
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anonymous key

### Step 4: Save and Redeploy
1. **Save Changes**: Click "Save" after adding all variables
2. **Trigger Redeploy**: Go to "Deploys" tab and click "Trigger deploy" → "Deploy site"

---

## Method 2: Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login and Link Site
```bash
netlify login
netlify link
```

### Step 3: Set Environment Variables
```bash
# Add Eleven Labs API key
netlify env:set VITE_ELEVENLABS_API_KEY "your_elevenlabs_api_key_here"

# Add Gemini API key
netlify env:set VITE_GEMINI_API_KEY "your_gemini_api_key_here"

# Add Supabase variables (if using)
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
```

### Step 4: Redeploy
```bash
netlify deploy --prod
```

---

## Method 3: netlify.toml File (Advanced)

### Create netlify.toml in your project root:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  # Note: Don't put sensitive keys here as they'll be in your repository
  # Use this only for non-sensitive configuration

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  # Production-specific environment variables
  # Still use Netlify dashboard for sensitive keys

[context.deploy-preview.environment]
  # Deploy preview environment variables
```

---

## 🔑 Getting Your API Keys

### Eleven Labs API Key:
1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up/Login
3. Go to your profile → API Keys
4. Copy your API key

### Google Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your API key

### Supabase Keys (if using):
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to Settings → API
4. Copy URL and anon key

---

## 🔒 Security Best Practices

### ✅ DO:
- Use Netlify dashboard for sensitive keys
- Prefix client-side variables with `VITE_`
- Keep API keys secure and never commit them to git
- Use different keys for development and production

### ❌ DON'T:
- Put sensitive keys in netlify.toml (it's in your repo)
- Share API keys publicly
- Use production keys in development
- Commit .env files to version control

---

## 🚨 Important Notes

### For Vite Applications:
- **All environment variables must be prefixed with `VITE_`**
- Example: `VITE_ELEVENLABS_API_KEY` not `ELEVENLABS_API_KEY`
- This is a Vite security feature

### After Adding Variables:
1. **Always redeploy** your site after adding environment variables
2. **Check the build logs** to ensure variables are being loaded
3. **Test the features** that depend on these variables

### Troubleshooting:
- If variables aren't working, check the prefix (`VITE_`)
- Ensure you've redeployed after adding variables
- Check browser console for any API key errors
- Verify API keys are valid and have proper permissions

---

## 📱 Quick Setup Checklist

- [ ] Get Eleven Labs API key from elevenlabs.io
- [ ] Get Gemini API key from Google AI Studio
- [ ] Add `VITE_ELEVENLABS_API_KEY` to Netlify
- [ ] Add `VITE_GEMINI_API_KEY` to Netlify
- [ ] Redeploy your site
- [ ] Test voice features and AI generation
- [ ] Verify all features work in production

---

## 🎯 Result

After completing these steps:
- ✅ Professional female voice coach will work in production
- ✅ AI-powered question generation will function
- ✅ All premium features will be available
- ✅ Your app will have the same functionality as in development

The voice coach will use a professional female voice (Bella) optimized for interview practice, providing realistic interview simulation with clear, articulate delivery.