# Household Expense Tracker via Voice Memos

This web application allows a user to track their household expenses by uploading audio voice memos. It uses the Google Gemini API to perform voice-to-text transcription and extract key details (amount, category, date) from unstructured audio. The user can then review and correct the extracted data before saving it to a monthly report.

## Features

- **File Upload**: Upload multiple audio files at once.
- **AI-Powered Transcription**: Uses Gemini 1.5 Pro to analyze audio.
- **Data Extraction**: Intelligently pulls out amount, category, and date.
- **Review & Correct**: A simple interface to review and edit the extracted data before saving.
- **Monthly Report**: View a summary of expenses for the month, including a total and a breakdown by category with a pie chart.

## Technology Stack

- **Backend**: Python 3, Flask, Flask-SQLAlchemy
- **Frontend**: Node.js, React (with Vite), Axios, Chart.js
- **Database**: SQLite
- **AI Service**: Google Gemini API

---

## Project Setup and Installation

Follow these instructions to get the application running on your local machine.

### Prerequisites

- Python 3.8+ and `pip`
- Node.js 18+ and `npm`
- A Google Gemini API Key

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For Unix/macOS
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

3.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set the Gemini API Key:**
    This application requires a Google Gemini API key to function. Set it as an environment variable named `GEMINI_API_KEY`.

    ```bash
    # For Unix/macOS
    export GEMINI_API_KEY="YOUR_API_KEY_HERE"

    # For Windows (in Command Prompt)
    set GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```
    **Important:** Do not hardcode your API key in the source code.

5.  **Run the Flask Backend Server:**
    The server will start on `http://127.0.0.1:5001`.
    ```bash
    flask --app run:app run
    ```
    (Note: The `run.py` is also configured to run with `python run.py`, but using `flask run` is standard.)

### Frontend Setup

1.  **Navigate to the frontend directory (from the root):**
    ```bash
    cd frontend
    ```

2.  **Install the required Node.js packages:**
    ```bash
    npm install
    ```

3.  **Run the Vite Frontend Development Server:**
    The development server will start, typically on `http://localhost:5173`.
    ```bash
    npm run dev
    ```

---

## How to Use

1.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  You will see the **Uploader**. Click the "Choose Files" button and select one or more of your audio expense memos.
3.  Click the **"Upload and Process Files"** button. The application will send the files to the backend.
4.  The backend processes each file with the Gemini API. Once complete, the **Review Page** will appear below the uploader.
5.  Review the data in the table. You can correct any values by typing directly into the input fields. You can also delete a transaction if it's incorrect.
6.  Once you are satisfied with the data, click the **"Save All Corrected Transactions"** button.
7.  After saving, you will be taken to the **Monthly Report** page, which shows a summary and a pie chart of your expenses.
8.  Click **"Upload More Files"** to return to the start.
