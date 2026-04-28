#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');
const prompts = require('prompts');
const pc = require('picocolors');

const REPO_URL = 'https://github.com/neocore-tech/SIMAJU-CORE-FRAMEWORK.git';

async function init() {
  console.log(pc.blue(`\n================================================`));
  console.log(pc.bold(pc.cyan(`   🚀  Welcome to SIMAJU Core Framework  🚀   `)));
  console.log(pc.blue(`================================================\n`));

  // 1. Dapatkan nama proyek dari argumen, atau tanya via prompt
  let targetDir = process.argv[2];

  if (!targetDir) {
    const res = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'What is your project named?',
      initial: 'my-simaju-app',
      validate: value => value.trim().length > 0 ? true : 'Project name cannot be empty'
    });
    
    if (!res.projectName) {
      console.log(pc.red('❌ Operation cancelled.'));
      process.exit(1);
    }
    targetDir = res.projectName.trim();
  }

  const projectPath = path.resolve(process.cwd(), targetDir);

  if (fs.existsSync(projectPath)) {
    console.log(pc.red(`\n❌ Error: Directory "${targetDir}" already exists.`));
    process.exit(1);
  }

  // 2. Tanya jenis Database
  const dbRes = await prompts({
    type: 'select',
    name: 'dbClient',
    message: 'Which database do you want to use?',
    choices: [
      { title: 'SQLite (Fastest for testing/development)', value: 'sqlite' },
      { title: 'MySQL', value: 'mysql' },
      { title: 'PostgreSQL', value: 'pg' }
    ],
    initial: 0
  });

  if (!dbRes.dbClient) {
    console.log(pc.red('❌ Operation cancelled.'));
    process.exit(1);
  }

  // 3. Clone repository
  console.log(pc.cyan(`\n📥 Cloning framework into ${pc.bold(targetDir)}...`));
  try {
    // Gunakan depth 1 agar download jauh lebih cepat (tanpa history git lama)
    execSync(`git clone --depth 1 ${REPO_URL} "${targetDir}"`, { stdio: 'inherit' });
  } catch (error) {
    console.log(pc.red('\n❌ Failed to clone repository. Do you have git installed?'));
    process.exit(1);
  }

  // 4. Bersihkan file git bawaan
  console.log(pc.cyan(`🧹 Cleaning up repository...`));
  const gitPath = path.join(projectPath, '.git');
  if (fs.existsSync(gitPath)) {
    fs.rmSync(gitPath, { recursive: true, force: true });
  }
  
  // Hapus file installer bawaan (setup.sh / install.sh) yang sudah tidak dibutuhkan user
  const filesToRemove = ['setup.sh', 'install.sh', 'packages'];
  for (const file of filesToRemove) {
      const p = path.join(projectPath, file);
      if (fs.existsSync(p)) {
          fs.rmSync(p, { recursive: true, force: true });
      }
  }

  // 5. Setup Environment (.env)
  console.log(pc.cyan(`🔐 Generating secure keys and environment...`));
  const envExamplePath = path.join(projectPath, '.env.example');
  const envPath = path.join(projectPath, '.env');

  if (fs.existsSync(envExamplePath)) {
    let envContent = fs.readFileSync(envExamplePath, 'utf8');

    // Generate Kunci Rahasia Acak
    const newJwtSecret = crypto.randomBytes(32).toString('hex');
    const newAdminKey = crypto.randomBytes(24).toString('hex');

    // Replace default values
    envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${newJwtSecret}`);
    envContent = envContent.replace(/SIMAJU_ADMIN_KEY=.*/g, `SIMAJU_ADMIN_KEY=${newAdminKey}`);
    
    // Sesuaikan Database
    envContent = envContent.replace(/DB_CONNECTION=.*/g, `DB_CONNECTION=${dbRes.dbClient}`);

    // Tulis ke .env
    fs.writeFileSync(envPath, envContent);
  }

  // 6. Install NPM Dependencies
  console.log(pc.cyan(`📦 Installing NPM dependencies... (This might take a minute)`));
  try {
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
  } catch (error) {
    console.log(pc.red('\n⚠️ Failed to install dependencies automatically.'));
    console.log(`Please run ${pc.bold('npm install')} inside the folder manually.`);
  }

  // 7. Inisialisasi Git Baru
  console.log(pc.cyan(`🌱 Initializing new Git repository...`));
  try {
    execSync('git init', { cwd: projectPath, stdio: 'ignore' });
    execSync('git add .', { cwd: projectPath, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from create-simaju-app"', { cwd: projectPath, stdio: 'ignore' });
  } catch (err) {
    // Ignore if git is not configured completely
  }

  // 8. Selesai
  console.log(pc.green(`\n✅ Project ${pc.bold(targetDir)} created successfully!\n`));
  
  console.log(`To get started, run:\n`);
  console.log(pc.blue(`  cd ${targetDir}`));
  
  if (dbRes.dbClient === 'sqlite') {
      console.log(pc.blue(`  ./mji migrate`));
      console.log(pc.blue(`  ./mji seed`));
  } else {
      console.log(pc.yellow(`  # Jangan lupa set konfigurasi DB_${dbRes.dbClient.toUpperCase()} di file .env Anda!`));
      console.log(pc.blue(`  ./mji migrate`));
  }
  
  console.log(pc.blue(`  ./mji up\n`));
  console.log(pc.cyan(`Happy Coding! 🚀\n`));
}

init().catch(err => {
  console.error(pc.red('\n❌ Unexpected error occurred:'));
  console.error(err);
  process.exit(1);
});
