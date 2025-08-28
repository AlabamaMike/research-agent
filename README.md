# Vibes for normies - from anywhere you can access GitHub

A repository with GitHub Codespaces configuration that includes Claude Code with OAUTH Token Authentication with issue templates and GitHub Action workflows that let you drive the vibe coding process without an IDE

## Setup

1. Fork this repository
2. Create a Codespace from your fork
3. Launch your codespace
4. Run claude code from a terminal
5. run the installer for the GitHub plugin /install-github-connector
6. If the installer ran successfully, you might not need to go to the next step
7. Set your `CLAUDE_CODE_OAUTH_TOKEN` environment variable in GitHub Codespaces secrets:
   - Go to [GitHub Codespaces Settings](https://github.com/settings/codespaces)
   - Click "New secret"
   - Name: `CLAUDE_CODE_OAUTH_TOKEN`
   - Value: Your OAUTH Token from the installer flow
   - Select your forked repository

8. Launch your Codespace - you'll see a prompt if the API key isn't set

## Using Claude Code

Once your Codespace is set up with your API key, simply use Claude Code with:

```bash
claude
```

Or with a specific question:

```bash
claude "What does this repository do?"
```

## Troubleshooting

If you see a warning about missing API key when the Codespace starts:

1. Follow the on-screen instructions to set up your API key or OAUTH TOKEN
2. After adding the secret, you may need to rebuild your Codespace for it to take effect
3. Alternatively, you can set the key for your current session with:
   ```bash
   export ANTHROPIC_API_KEY=your-api-key-here
   ```
