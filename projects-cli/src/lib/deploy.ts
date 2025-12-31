import { confirm } from '@inquirer/prompts'
import { execSync } from 'child_process'
import { REPO_PATH } from '../utils/config'

export async function autoDeploy(commitMessage: string): Promise<boolean> {
  const shouldDeploy = await confirm({ message: 'commit and push to deploy?', default: true })

  if (!shouldDeploy) {
    console.log('skipped deploy')
    return false
  }

  try {
    console.log('committing...')
    execSync(`git add -A`, { cwd: REPO_PATH, stdio: 'inherit' })
    execSync(`git commit -m "${commitMessage}"`, { cwd: REPO_PATH, stdio: 'inherit' })

    console.log('pushing...')
    execSync(`git push`, { cwd: REPO_PATH, stdio: 'inherit' })

    console.log('\ndone! vercel will deploy in ~30s')
    return true
  } catch (e) {
    console.error(`deploy error: ${e}`)
    return false
  }
}
