# 🚀 Deployment Guide

## 📋 Pre-deployment Checklist

### ✅ Required Files
- [ ] `package.json` with all dependencies
- [ ] `next.config.js` (if custom config needed)
- [ ] `tailwind.config.js`
- [ ] `tsconfig.json`
- [ ] `server.js` (Socket.IO server)
- [ ] All source files in `src/`
- [ ] Flag images in `public/img/` (optional)

### ❌ Files to Exclude
- [ ] `node_modules/`
- [ ] `.env` files
- [ ] `.next/` build folder
- [ ] Log files
- [ ] IDE settings

## 🌐 Deployment Options

### 1. Vercel (Recommended for Next.js)

**Steps:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel auto-detects Next.js
5. Deploy!

**Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### 2. Netlify

**Steps:**
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect GitHub repository
4. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
5. Deploy!

### 3. Railway

**Steps:**
1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Connect GitHub repository
4. Railway auto-detects Node.js
5. Deploy!

### 4. Heroku

**Steps:**
1. Create `Procfile`:
```
web: npm start
```
2. Push to GitHub
3. Connect to Heroku
4. Deploy!

## 🔧 Environment Variables

For production, you may need to set:

```bash
# Optional API keys
ALPHA_VANTAGE_API_KEY=your_key_here
EXCHANGERATE_API_KEY=your_key_here

# Port (usually auto-set by platform)
PORT=3000
```

## 📱 Mobile Optimization

The app is already optimized for mobile:
- Responsive design
- Touch-friendly interface
- Fast loading
- PWA-ready

## 🚨 Important Notes

1. **Socket.IO Server**: Make sure your hosting platform supports WebSockets
2. **API Limits**: Free APIs have rate limits
3. **HTTPS**: Required for WebSocket connections in production
4. **CORS**: Configure if needed for API calls

## 🔍 Testing After Deployment

1. ✅ Check all pages load
2. ✅ Test language switching
3. ✅ Verify TradingView charts
4. ✅ Test real-time signals
5. ✅ Check mobile responsiveness

## 🆘 Troubleshooting

### Common Issues:

**Charts not loading:**
- Check TradingView widget configuration
- Verify HTTPS connection

**Signals not updating:**
- Check Socket.IO connection
- Verify server is running

**Language not switching:**
- Check flag images in `public/img/`
- Verify translation files

**Build errors:**
- Check TypeScript errors
- Verify all dependencies installed

## 📞 Support

If you encounter issues:
1. Check the console for errors
2. Verify all files are included
3. Test locally first
4. Open an issue on GitHub
