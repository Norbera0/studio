# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Configuration

This application is designed to integrate with various Google services. To enable them, you will need to provide credentials in an environment file.

1.  **Create an environment file:** Copy the example file `.env.example` to a new file named `.env`.
    ```bash
    cp .env.example .env
    ```
2.  **Fill in the credentials:** Open the `.env` file and add the necessary API keys and secrets you obtain from the Google Cloud Console and Google AI Studio. The comments in the file will guide you on where to find each value.
3.  **Restart your server:** After saving your `.env` file, restart the development server for the changes to take effect.

The application code will automatically detect these settings and enable the corresponding features (Google Auth, Google Drive storage, etc.). If a setting is left blank, the app will fall back to its local, file-based functionality.
