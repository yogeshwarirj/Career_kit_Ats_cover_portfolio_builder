# 🎤 Voice Setup Guide for CareerKit

## Quick Setup Steps

### 1. Get Your Eleven Labs API Key
1. Go to [ElevenLabs.io](https://elevenlabs.io)
2. Sign up for a free account (includes 10,000 characters/month)
3. Navigate to your [Profile → API Keys](https://elevenlabs.io/speech-synthesis)
4. Copy your API key

### 2. Add API Key to Environment
1. Open the `.env` file in your project root
2. Replace `your_elevenlabs_api_key_here` with your actual API key:
   ```
   VITE_ELEVENLABS_API_KEY=sk_your_actual_api_key_here
   ```
3. Save the file
4. Restart your development server (`npm run dev`)

### 3. Test Voice Features
1. Go to your homepage
2. Click the "Play" button on the AI character
3. You should now hear the AI speaking with a professional female voice!

## Voice Features Included

✅ **Professional Female Voice** - Uses "Bella" voice optimized for business communication  
✅ **Real-time Speech** - AI character speaks each message with natural timing  
✅ **Voice Controls** - Play/pause and mute/unmute functionality  
✅ **Visual Feedback** - Enhanced animations when speaking vs. just playing  
✅ **Error Handling** - Graceful fallback to text-only if API key isn't configured  

## Troubleshooting

### "Text only - Add API key for voice" Message
- This means the API key isn't configured properly
- Check that your `.env` file has the correct API key
- Make sure to restart the dev server after adding the key
- Verify the API key starts with `sk_` and is from ElevenLabs

### No Sound Playing
- Check your browser's audio settings
- Make sure the volume isn't muted
- Try clicking the volume button to unmute
- Check browser console for any error messages

### API Quota Exceeded
- Free tier includes 10,000 characters per month
- Upgrade to a paid plan for unlimited usage
- Monitor usage in your ElevenLabs dashboard

## Free Tier Limits
- **10,000 characters/month** - Perfect for testing and light usage
- **3 custom voices** - Use professional pre-made voices
- **High-quality audio** - 22kHz sample rate

## Production Deployment
When deploying to production (Netlify, Vercel, etc.), make sure to:
1. Add the environment variable in your hosting platform's settings
2. Use the same variable name: `VITE_ELEVENLABS_API_KEY`
3. Test the voice features after deployment

## Security Note
- Never commit your API key to version control
- The `.env` file is already in `.gitignore`
- Use different API keys for development and production