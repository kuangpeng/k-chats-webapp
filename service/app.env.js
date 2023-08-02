const path = require('path');
const fs = require('fs');
const dotEnv = require('dotenv');

// 先构造出.env*文件的绝对路径
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const pathsDotenv = resolveApp('.env');

// 按优先级由高到低的顺序加载.env文件
dotEnv.config({ path: `${pathsDotenv}.local` }); // 加载.env.local

const nodeEnv = process.env.NODE_ENV || 'development';
dotEnv.config({ path: `${pathsDotenv}.${nodeEnv}` }); // 加载.env.development

dotEnv.config({ path: `${pathsDotenv}` }); // 加载.env
