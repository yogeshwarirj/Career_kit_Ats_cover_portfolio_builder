# 🎤 Quick Voice Setup - 2 Minutes!

## The Issue
You're seeing "Voice setup needed" because the Eleven Labs API key isn't configured.

## ⚡ Quick Fix (2 steps):

### Step 1: Get FREE API Key
1. Go to **[ElevenLabs.io](https://elevenlabs.io)** 
2. Click **"Sign Up"** (it's free!)
3. Go to **Profile → API Keys**
4. **Copy** your API key (starts with `sk_`)

### Step 2: Add to .env File
1. Open the **`.env`** file in your project
2. Replace this line:
   ```
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```
   With your actual key:
   ```
   VITE_ELEVENLABS_API_KEY=sk_your_actual_key_here
   ```
3. **Save** the file
4. **Restart** your dev server: `npm run dev`

## ✅ Test It Works
1. Go to your homepage
2. Click the **Play** button on the AI character
3. You should hear her speak! 🎉

## 🆓 Free Tier Includes:
- **10,000 characters/month** (plenty for testing)
- **Professional female voice** (Bella)
- **High-quality audio** synthesis
- **No credit card required**

## 🚨 Still Having Issues?

### Common Problems:
- **API key doesn't start with `sk_`** → Get a new one from ElevenLabs
- **Still showing error** → Make sure you restarted the dev server
- **No sound** → Check browser volume and unmute button
- **"Quota exceeded"** → You've used your free 10k characters (upgrade or wait for next month)

### Need Help?
The AI character will show different status messages:
- 🟢 **"AI Assistant Speaking"** = Working perfectly!
- 🟡 **"Add API key for voice"** = Need to add your key
- 🔴 **Error message** = Check the console for details

---

**That's it!** Your AI character will come to life with professional voice synthesis. 🎤✨