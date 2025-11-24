import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to validate email configuration
export const validateEmailConfig = () => {
    const envPath = join(__dirname, '..', '.env');
    
    // console.log('Environment validation:', {
    //     envExists: fs.existsSync(envPath),
    //     envPath,
    //     workingDir: process.cwd(),
    //     nodeEnv: process.env.NODE_ENV
    // });

    // Read .env file directly to check format
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        // console.log('ENV file analysis:', {
        //     totalLines: lines.length,
        //     hasEmailLine: lines.some(line => line.startsWith('USER_EMAIL=')),
        //     hasPasswordLine: lines.some(line => line.startsWith('USER_PASSWORD=')),
        //     linesWithSpaces: lines
        //         .map(line => line.trim())
        //         .filter(line => line && !line.startsWith('#'))
        //         .filter(line => line.includes(' '))
        //         .map(line => line.split('=')[0])
        // });
    }

    // Validate email format
    const email = process.env.USER_EMAIL?.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
        throw new Error('Invalid email format in USER_EMAIL');
    }

    // Validate password (app password should be 16 chars, no spaces)
    const password = process.env.USER_PASSWORD?.trim();
    if (!password || password.includes(' ') || password.length !== 16) {
        throw new Error('Invalid Gmail app password format (should be 16 characters, no spaces)');
    }

    return true;
};