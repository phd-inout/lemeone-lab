#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const appDir = path.resolve(__dirname, '..');
const args = process.argv.slice(2);

/**
 * Handle "skills" command
 */
function handleSkills(subCommand, targetUrl) {
  const geminiSkillsDir = path.join(os.homedir(), '.gemini', 'skills');
  const internalSkillPath = path.join(appDir, 'skills', 'business-intelligence');
  const targetSkillPath = path.join(geminiSkillsDir, 'business-intelligence');

  if (subCommand === 'install' || !subCommand) {
    console.log(`\n🧠 Installing Lemeone Strategic Skill...`);
    
    try {
      if (!fs.existsSync(geminiSkillsDir)) {
        fs.mkdirSync(geminiSkillsDir, { recursive: true });
      }

      // Recursive copy function
      const copyRecursiveSync = function(src, dest) {
        if (!fs.existsSync(src)) return;
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest);
          fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      };

      copyRecursiveSync(internalSkillPath, targetSkillPath);
      console.log(`✅ Skill "business-intelligence" installed to global library.`);
      console.log(`✨ You can now run: activate_skill business-intelligence\n`);
    } catch (e) {
      console.error(`❌ Failed to install skill: ${e.message}`);
    }
    process.exit(0);
  }

  if (subCommand === 'add' && targetUrl) {
    console.log(`\n📦 Adding skill from: ${targetUrl}`);
    const skillsDir = path.join(appDir, 'skills');
    
    if (!fs.existsSync(skillsDir)) {
      fs.mkdirSync(skillsDir);
    }

    const skillName = targetUrl.split('/').pop().replace('.git', '');
    const destPath = path.join(skillsDir, skillName);

    if (fs.existsSync(destPath)) {
      console.log(`⚠️  Skill "${skillName}" already exists. Updating...`);
      try {
        execSync('git pull', { cwd: destPath, stdio: 'inherit' });
        console.log(`✅ Updated ${skillName}`);
      } catch (e) {
        console.error(`❌ Failed to update ${skillName}: ${e.message}`);
      }
    } else {
      try {
        console.log(`🚚 Cloning into ${destPath}...`);
        execSync(`git clone ${targetUrl} ${skillName}`, { cwd: skillsDir, stdio: 'inherit' });
        console.log(`✅ Successfully added skill: ${skillName}`);
      } catch (e) {
        console.error(`❌ Failed to add skill: ${e.message}`);
      }
    }
    process.exit(0);
  } else {
    console.log('\nUsage:');
    console.log('  npx lemeone-skill                  (Install bundled 14D skill)');
    console.log('  npx lemeone-skill add <github-url> (Add external skill)');
    process.exit(1);
  }
}

/**
 * Handle "hook" command
 */
function handleHook() {
  const subCommand = args[1];
  const hookPath = path.join(appDir, '.git', 'hooks', 'prepare-commit-msg');

  if (subCommand === 'install') {
    console.log('\n⚓ Installing Lemeone Strategic Git Hook...');
    const hookContent = `#!/bin/sh\nnode "${path.join(appDir, 'scripts', 'git-hook-audit.js')}" "$1"`;
    
    try {
      fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
      console.log('✅ Git hook installed successfully at .git/hooks/prepare-commit-msg');
      console.log('✨ Your next commit will include a strategic gravity brief!\n');
    } catch (e) {
      console.error(`❌ Failed to install hook: ${e.message}`);
    }
    process.exit(0);
  } else {
    console.log('\nUsage:');
    console.log('  npx lemeone-sandbox hook install');
    process.exit(1);
  }
}

// Route commands
const isSkillCommand = path.basename(process.argv[1]) === 'lemeone-skill' || args[0] === 'skills';

if (isSkillCommand) {
  const subCommand = args[0] === 'skills' ? args[1] : args[0];
  const targetUrl = args[0] === 'skills' ? args[2] : args[1];
  handleSkills(subCommand, targetUrl);
} else if (args[0] === 'hook') {
  handleHook();
} else {
  // Default: Start Server
  console.log('🚀 Starting LemeoneLab 2.0 Local Engine...');

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('\n⚠️  WARNING: GOOGLE_GENERATIVE_AI_API_KEY is not set in your environment.');
    console.log('   The simulation requires Google Gemini Flash to generate events.');
    console.log('   Please export GOOGLE_GENERATIVE_AI_API_KEY="your-key" and run again.\n');
  }

  console.log('📦 Initializing local SQLite database...');
  try {
    execSync('npx prisma db push', { cwd: appDir, stdio: 'inherit' });
  } catch (e) {
    console.error('❌ Failed to initialize database.');
    process.exit(1);
  }

  console.log('🌐 Starting local server...');
  const server = spawn('npm', ['run', 'dev'], { cwd: appDir, stdio: 'inherit' });

  setTimeout(() => {
    const url = 'http://localhost:3000';
    console.log(`\n✨ LemeoneLab is running at ${url}\n`);
    const openCmd = os.platform() === 'win32' ? 'start' : os.platform() === 'darwin' ? 'open' : 'xdg-open';
    try {
      execSync(`${openCmd} ${url}`);
    } catch (e) {}
  }, 3000);

  server.on('close', (code) => {
    process.exit(code);
  });
}
