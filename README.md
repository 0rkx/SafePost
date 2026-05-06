# SafePost

SafePost is a privacy-first web application designed to help users automatically redact Personally Identifiable Information (PII) and anonymize faces in photographs before sharing them online. It provides an intuitive interface for uploading images, specifying elements to preserve, and leveraging Google's Gemini AI to intelligently process the image. The project is built as a fully client-side React application using Vite and TypeScript.

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Important Code Concepts](#important-code-concepts)
- [Architectural Decisions](#architectural-decisions)
- [Main User Flows](#main-user-flows)
- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [Configuration Notes](#configuration-notes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Learning Outcomes](#learning-outcomes)

## About the Project

Sharing images online often inadvertently exposes sensitive information such as license plates, addresses, ID badges, or the faces of bystanders. SafePost addresses this problem by acting as an intelligent privacy filter. Users can upload a photo and provide natural language instructions detailing what they want to preserve (e.g., "Keep the dog visible but blur everything else"). The application then uses a generative AI model to seamlessly anonymize the rest of the image, maintaining the original lighting and composition without relying on jarring black boxes.

The current implementation is designed as a rapid prototype. It executes the entire workflow in the browser by communicating directly with the Google Gemini API, making it easy to run locally for testing the core AI redaction mechanics.

## Key Features

### Intelligent Image Upload and Preview
Users can drag and drop or manually select image files. The application generates a local object URL to display a preview before any processing begins.

### Natural Language Preservation Requests
The application includes a text input where users can specify elements of the image they want to keep untouched. This is injected directly into the prompt sent to the AI, allowing for flexible, context-aware redaction.

### AI-Powered PII and Face Anonymization
Using the Gemini 2.5 Flash model, the application processes the image to realistically inpaint or blur faces and text that were not explicitly preserved.

### State-Driven Workflow
The UI strictly follows a defined state machine (`IDLE`, `PREVIEW`, `PROCESSING`, `COMPLETE`, `ERROR`). This ensures the user is always aware of what is happening, with dedicated loading and error recovery screens.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React (v19) / TypeScript | Drives the user interface and component logic. |
| Styling | Tailwind CSS | Provides rapid, utility-first styling for a clean, modern interface. |
| Build Tool | Vite | Serves as the local development server and bundler, offering fast HMR. |
| AI Integration | `@google/genai` | The official SDK used to communicate with the Google Gemini API for image processing. |

## System Architecture

The application follows a straightforward client-side architecture.

When a user uploads an image and submits it for processing, the React frontend converts the file into a base64 string. The `geminiService` constructs a detailed prompt combining the user's preservation requests with strict rules for face and PII anonymization. This payload is sent directly from the browser to the Gemini API. The API returns a modified base64 image, which the frontend then renders as a data URI.

```txt
User Input (Image + Text)
  ↓
React UI / State Machine (App.tsx)
  ↓
Image Conversion (utils/imageUtils.ts)
  ↓
AI Service (services/geminiService.ts)
  ↓
Google Gemini API
  ↓
Safe Base64 Image Rendered in UI
```

## Folder Structure

```
src/
  components/           # Reusable React UI components
    ErrorDisplay.tsx    # Renders error states and retry logic
    ImageDisplay.tsx    # Shows the final original/safe image comparison
    ImagePreview.tsx    # Displays the pre-processing preview and input form
    ImageUploader.tsx   # Handles drag-and-drop file selection
    Loader.tsx          # Displays loading states during API calls
  services/             # External API integration
    geminiService.ts    # Contains the prompt template and Gemini API logic
  utils/                # Helper functions
    imageUtils.ts       # Logic for converting Files to base64 strings
  App.tsx               # Main application shell and state orchestrator
  types.ts              # TypeScript enums and interfaces for the state machine
  index.tsx             # React DOM entry point
  vite.config.ts        # Vite configuration and environment variable mapping
```

## Important Code Concepts

### Explicit State Machine
The core of the application is governed by the `AppState` union type and `AppStatus` enum defined in `types.ts`. `App.tsx` uses a single state object to transition between the different phases of the application (`IDLE`, `PREVIEW`, `PROCESSING`, `COMPLETE`, `ERROR`). This strongly-typed approach eliminates impossible states (e.g., trying to show an error when the app is in the `IDLE` state).

### Direct AI Prompting and Modality Configuration
The `geminiService.ts` file uses a predefined `PROMPT_TEMPLATE` that strictly instructs the AI to prioritize face anonymization and PII redaction while respecting user exceptions. The API call uses `responseModalities: [Modality.IMAGE, Modality.TEXT]` to ensure the AI attempts to return visual data rather than just a textual description.

## Architectural Decisions

### Client-Side API Calls for Rapid Prototyping
The current codebase makes calls to the Google Gemini API directly from the browser (`geminiService.ts`). This decision makes sense for a hackathon or prototype stage, as it eliminates the need to stand up and host a separate Node.js or Python backend.

*Tradeoff:* Because the API key is injected into the client bundle via `vite.config.ts` and environment variables, this architecture is strictly for local development or controlled demos. It is not secure for a public production deployment, as the API key would be exposed to end-users.

### In-Memory Object URLs
To display user uploads immediately, the app uses `URL.createObjectURL()`. The `App.tsx` component correctly manages the lifecycle of these URLs, revoking them during reset operations to prevent memory leaks. This avoids the need to temporarily store uploads on a server or in local storage.

## Main User Flows

1. **Upload Initiation:** The user arrives at the `IDLE` state and drops an image into the `ImageUploader` component.
2. **Review and Configuration:** The app transitions to `PREVIEW`. The user sees the image and can optionally type in elements they want to preserve (e.g., "The cat on the left").
3. **Processing:** The user clicks process. The app enters the `PROCESSING` state. The image is converted to base64, and the prompt is sent to the Gemini API.
4. **Completion:** Upon a successful response, the app enters `COMPLETE`, rendering the `ImageDisplay` component to show the sanitized result.
5. **Error Handling:** If the API fails or returns text instead of an image, the app enters the `ERROR` state, showing `ErrorDisplay` with an option to retry without re-uploading the file.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm
- A Google Gemini API Key

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the necessary dependencies:
```bash
npm install
```

### Environment Variables

You must provide a Gemini API key for the application to function. Create a `.env` file in the root directory based on the configuration required by Vite:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Running Locally

Start the Vite development server:
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with hot-module replacement. |
| `npm run build` | Compiles TypeScript and builds the production bundle into the `dist` folder. |
| `npm run preview` | Boots up a local static web server that serves the production build from `dist`. |

## Configuration Notes

- `vite.config.ts`: Configures the Vite build setup. Crucially, it maps the `GEMINI_API_KEY` from the `.env` file into `process.env.API_KEY` so the Gemini SDK can access it in the browser environment.
- `tsconfig.json`: Defines TypeScript compilation rules, heavily optimized for Vite (`"moduleResolution": "bundler"`, `"noEmit": true`).
- `tailwind.config.js`: (Implied by the Tailwind CDN in `index.html`) Provides utility classes for UI styling.

## Testing

Automated tests are not currently included in this prototype.

Given the application's structure, realistic future test areas would include:
- **Unit Tests:** Verifying the `fileToStrippedBase64` logic in `imageUtils.ts`.
- **Component Tests:** Ensuring `App.tsx` correctly transitions through all `AppStatus` enum states based on mocked API responses.
- **Integration Tests:** Mocking the `@google/genai` library to ensure the prompt template is constructed and sent correctly based on user input.

## Deployment

No deployment-specific configuration (like `vercel.json` or `netlify.toml`) was found. Since this is a Vite-based React frontend, the output of `npm run build` can be deployed to standard static hosting platforms (Vercel, Netlify, Cloudflare Pages).

*Important:* As noted in the architectural decisions, deploying this code publicly as-is will expose the Gemini API key. A production deployment requires migrating the `geminiService.ts` logic to a backend proxy.

## Future Improvements

- **Backend Proxy Integration:** Move the Gemini API call to a serverless function (e.g., Vercel Functions or an Express server) to secure the API key.
- **Image Cropping/Pre-processing:** Allow users to crop the image before sending it to the AI to save tokens and improve accuracy.
- **Gallery/History:** Integrate local storage or a database (like Supabase) to save previously processed images and prompts.
- **Download Functionality:** Add a direct "Download Safe Image" button to the `COMPLETE` state UI.

## Learning Outcomes

This project demonstrates a practical application of generative AI beyond text chat. It highlights how to manage complex, multi-step asynchronous UI workflows using strict TypeScript state machines. By integrating a vision-capable AI model directly into a browser application, it shows an understanding of modern API capabilities, file handling via object URLs, and the tradeoffs involved in rapid prototyping.
