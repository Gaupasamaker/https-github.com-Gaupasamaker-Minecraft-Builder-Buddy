# Builder Buddy / Compañero Constructor 🛠️

Builder Buddy is an AI-powered web application designed to help kids (and adults!) find inspiration and guidance for their Minecraft builds. It uses Google's Gemini API to generate creative ideas, visualize them, and provide step-by-step building instructions.

![Builder Buddy App](https://images.unsplash.com/photo-1607513168936-977d560d7142?q=80&w=1200&auto=format&fit=crop)

## ✨ Features

- **💡 Idea Generator**: Get creative building suggestions across various categories (Houses, Vehicles, Monuments, Redstone, etc.).
  - **Visual Previews**: Automatically generates an image of what the build could look like.
  - **Step-by-Step Guides**: Detailed instructions with material lists and helpful tips.
  - **Real World Inspiration**: Suggests famous real-world structures alongside fantasy creations.

- **🤖 Master Builder Chat**: An interactive AI assistant that acts as an expert Minecraft guide. Ask for help, specific ideas, or troubleshooting.

- **📸 Biome Scanner**: Upload a screenshot or take a photo of your Minecraft world. The AI analyzes the biome and terrain to suggest builds that fit perfectly in that environment.

- **🏆 Gamification**:
  - **Achievements**: Unlock over 20 unique badges like "Wood Master", "Redstone Engineer", and "Legendary Builder".
  - **XP System**: Earn experience points for every build you complete.
  - **Leveling**: Level up your builder profile from Novice to Legend.

- **❤️ Favorites**: Save your favorite blueprints to your personal library to build later.

- **🌍 Multi-language Support**: Fully localized in **English** and **Spanish**.

## 🚀 Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)
  - `gemini-2.5-flash` for text generation and chat.
  - `gemini-2.5-flash-image` for image generation and vision analysis.
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

## 🛠️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/builder-buddy.git
    cd builder-buddy
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Build for production**
    ```bash
    npm run build
    ```

## 🎮 How to Use

1.  **Select a Language**: Toggle between English (EN) and Spanish (ES) in the top right corner.
2.  **Choose a Tool**:
    - **Idea Generator**: Pick a category and browse generated cards. Click one to see the guide.
    - **Chat**: Talk to the bot for custom advice.
    - **Scanner**: Upload a game screenshot to get context-aware ideas.
3.  **Build & Earn**: Follow the guides, click "Complete Build" to earn XP, and unlock achievements!

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
