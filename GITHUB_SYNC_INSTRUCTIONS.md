# 🔄 GitHub Sync Instructions

## Current Status
✅ **Bolt Environment**: Updated with build fixes  
❌ **GitHub Repository**: Needs these updates  
❌ **Netlify**: Will auto-deploy once GitHub is updated  

## 📋 Files That Need to Be Updated on GitHub

### 1. package.json
Add this dependency to your `devDependencies` section:
```json
"terser": "^5.31.0"
```

### 2. vite.config.ts
Replace the minification section with:
```typescript
// Use esbuild for minification instead of terser for faster builds
minify: 'esbuild',
// Target modern browsers for better optimization
target: 'es2020'
```

## 🚀 How to Update GitHub

### Option A: Manual File Update
1. Go to your GitHub repository
2. Edit `package.json` and add the terser dependency
3. Edit `vite.config.ts` with the new minification settings
4. Commit the changes

### Option B: Download & Push
1. Download the updated files from this Bolt environment
2. Replace the files in your local Git repository
3. Run:
   ```bash
   git add .
   git commit -m "Fix Netlify build: Add terser dependency and optimize Vite config"
   git push origin main
   ```

### Option C: Copy Full File Contents
I can provide the complete file contents below for easy copy-paste.

## 🎯 Expected Result
- ✅ Netlify build will succeed
- ✅ Site will deploy successfully
- ✅ All performance optimizations will be active

## 📞 Need Help?
If you encounter any issues, let me know and I can provide more specific guidance!