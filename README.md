<p align="center">
  <img width="450" height="120" align="center" src="https://raw.githubusercontent.com/Ralex91/Quoosh/main/.github/logo.svg">
  <br>
  <div align="center">
    <img alt="Visitor Badge" src="https://api.visitorbadge.io/api/visitors?path=https://github.com/Ralex91/Quoosh/edit/main/README.md&countColor=%2337d67a">
    <img src="https://img.shields.io/docker/pulls/ralex91/Quoosh?style=for-the-badge&color=37d67a" alt="Docker Pulls">
  </div>
</p>

## 🧩 What is this project?

Quoosh is a straightforward and open-source clone of the Kahoot! platform, allowing users to host it on their own server for smaller events.

> ⚠️ This project is still under development, please report any bugs or suggestions in the [issues](https://github.com/Ralex91/Quoosh/issues)

<p align="center">
  <img width="30%" src="https://raw.githubusercontent.com/Ralex91/Quoosh/main/.github/preview1.jpg" alt="Login">
  <img width="30%" src="https://raw.githubusercontent.com/Ralex91/Quoosh/main/.github/preview2.jpg" alt="Manager Dashboard">
  <img width="30%" src="https://raw.githubusercontent.com/Ralex91/Quoosh/main/.github/preview3.jpg" alt="Question Screen">
</p>

## ⚙️ Prerequisites

Choose one of the following deployment methods:

### Without Docker

- Node.js : version 20 or higher
- PNPM : Learn more about [here](https://pnpm.io/)

## 📖 Getting Started (Local)

Follow these steps to run Quoosh locally without Docker.

1. Clone the repository:

```bash
git clone https://github.com/Ralex91/Quoosh.git
cd Quoosh
```

2. Install dependencies (from repo root):

```bash
pnpm install
```

3. Ensure you have a `.env` file at the repo root with these values (defaults):

```
WEB_ORIGIN=http://localhost:3000
SOCKET_URL=http://localhost:3001
```

4. Start both services in development (web + socket):

```bash
pnpm dev
```

4b. Or start services individually:

```bash
pnpm run dev:web
pnpm run dev:socket
```

5. Build and run for production:

```bash
pnpm run build
pnpm start
```

The app will be available at http://localhost:3000 and the socket server at http://localhost:3001.

## ⚙️ Configuration

The configuration is split into two main parts:

### 1. Game Configuration (`config/game.json`)

Main game settings:

```json
{
  "managerPassword": "PASSWORD",
  "music": true
}
```

Options:

- `managerPassword`: The master password for accessing the manager interface
- `music`: Enable/disable game music

### 2. Quiz Configuration (`config/quizz/*.json`)

Create your quiz files in the `config/quizz/` directory. You can have multiple quiz files and select which one to use when starting a game.

Example quiz configuration (`config/quizz/example.json`):

```json
{
  "subject": "Example Quiz",
  "questions": [
    {
      "question": "What is the correct answer?",
      "answers": ["No", "Yes", "No", "No"],
      "image": "https://images.unsplash.com/....",
      "solution": 1,
      "cooldown": 5,
      "time": 15
    }
  ]
}
```

Quiz Options:

- `subject`: Title/topic of the quiz
- `questions`: Array of question objects containing:
  - `question`: The question text
  - `answers`: Array of possible answers (2-4 options)
  - `image`: Optional URL for question image
  - `solution`: Index of correct answer (0-based)
  - `cooldown`: Time in seconds before showing the question
  - `time`: Time in seconds allowed to answer

## 🎮 How to Play

1. Access the manager interface at http://localhost:3000/manager
2. Enter the manager password (defined in quiz config)
3. Share the game URL (http://localhost:3000) and room code with participants
4. Wait for players to join
5. Click the start button to begin the game

## 📝 Contributing

1. Fork the repository
2. Create a new branch (e.g., `feat/my-feature`)
3. Make your changes
4. Create a pull request
5. Wait for review and merge

For bug reports or feature requests, please [create an issue](https://github.com/Ralex91/Quoosh/issues).

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Ralex91/Quoosh&type=date&legend=bottom-right)](https://www.star-history.com/#Ralex91/Quoosh&type=date&legend=bottom-right)
