
# ⚖️ Constitution India AI

An expert AI companion designed to empower Indian citizens with knowledge of their Constitutional rights and duties. Created by **Hrishikesh**, this application bridges the gap between complex legal text and everyday inquiries.

> "We Indians are proud of our vibrant democracy and the great Constitution of India."

---

## 🌟 Key Features

- **Legal Query Mapping**: Input any situation or question (e.g., "Do I have freedom of speech?") and get mapped directly to relevant Articles of the Indian Constitution.
- **AI-Powered Status Indicators**:
  - ✅ **Constitutionally Protected**: Your rights are secured.
  - ❌ **Violation / Prohibited**: Actions that go against the law.
  - ⚠️ **Context Dependent**: Complex scenarios with specific legal nuances.
- **Audio Explanations (TTS)**: Listen to simplified explanations of complex Articles using the high-quality **Gemini 2.5 Flash Native Audio** model.
- **Verbatim Citations**: Access the exact official text of the Articles cited for legal accuracy.
- **The Preamble**: A dedicated section honoring the core philosophy of our Republic.
- **Persistent History**: Your recent inquiries are saved locally so you can refer back to them anytime.
- **Modern UI/UX**: Built with a clean, scholarly aesthetic using Tailwind CSS and Playfair Display fonts.

---

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini API (@google/genai)](https://ai.google.dev/)
  - **Reasoning**: `gemini-3-pro-preview` (for deep legal analysis)
  - **Speech**: `gemini-2.5-flash-preview-tts` (for natural voice output)
- **Deployment**: ESM-based architecture for instant browser performance.

---

## 🛠️ Getting Started

### Prerequisites

- A modern web browser.
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### Running the Project

1.  **Clone the files** into your local directory.
2.  **Environment Variable**: Ensure your environment has an `API_KEY` set. If running locally with a tool like Vite, you might need to use `import.meta.env.VITE_API_KEY`.
3.  **Local Development**:
    ```bash
    # If using Vite
    npm install
    npm run dev
    ```
4.  **Browser Access**: Open the local URL (e.g., `http://localhost:5173`) to start consulting your AI expert.

---

## 📂 Project Structure

- `App.tsx`: Main application logic and layout.
- `services/geminiService.ts`: Core AI integration for text analysis and speech generation.
- `components/AnalysisCard.tsx`: Elegant display for AI results, status, and citations.
- `types.ts`: Strictly typed interfaces for legal data structures.
- `index.html`: Optimized head with fonts and Tailwind configuration.

---

## 📜 Disclaimer

**Constitution India AI** is an educational tool. While it uses advanced AI models to interpret the Indian Constitution, it **does not constitute professional legal advice**. Always consult with a qualified legal professional for specific legal matters.

---

## 🤝 Contributing

This project was created to serve the public. Feel free to suggest improvements or add more features related to the Directive Principles, Fundamental Duties, or specific Amendments!

**Created by Hrishikesh**
*Satyamev Jayate*
