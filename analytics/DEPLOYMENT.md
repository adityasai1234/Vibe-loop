# Mood Analytics Dashboard Deployment Guide

This guide provides instructions for deploying the VibeLoop Mood Analytics Dashboard to Google Cloud Run and exposing it through Firebase Hosting.

## Prerequisites

- Google Cloud Platform account with billing enabled
- Firebase project connected to your VibeLoop application
- Google Cloud SDK installed locally
- Firebase CLI installed locally
- Service account with appropriate permissions

## 1. Export Firestore Data

Before deploying the dashboard, you need to export mood history data from Firestore:

```bash
# Set up your Google Application Credentials
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-service-account-key.json"

# Run the export script for each user
pnpm ts-node scripts/exportFirestoreData.ts <firebase-uid>
```

## 2. Test Locally

Test the Streamlit dashboard locally before deployment:

```bash
cd analytics
pip install -r requirements.txt
streamlit run streamlit_app.py --server.port 8501
```

Visit http://localhost:8501 to verify the dashboard works correctly.

## 3. Build and Deploy to Cloud Run

```bash
# Set your Google Cloud project ID
export PROJECT_ID="your-gcp-project-id"

# Build the container image
gcloud builds submit --tag gcr.io/$PROJECT_ID/mood-analytics

# Deploy to Cloud Run
gcloud run deploy mood-analytics \
  --image gcr.io/$PROJECT_ID/mood-analytics \
  --region us-central1 \
  --allow-unauthenticated
```

Note the service URL provided after deployment.

## 4. Configure Firebase Hosting

The `firebase.json` file has been updated to include a rewrite rule for the `/analytics/**` path to the Cloud Run service.

Deploy the updated configuration:

```bash
# Build your frontend application
pnpm build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 5. Access the Dashboard

After deployment, the dashboard will be available at:

```
https://<your-firebase-domain>/analytics
```

## 6. (Optional) Secure with IAP

To restrict access to authorized users:

1. Go to the Google Cloud Console > Security > Identity-Aware Proxy
2. Enable IAP for your Cloud Run service
3. Add authorized Google accounts or groups

## Troubleshooting

- If the dashboard doesn't appear, check Cloud Run logs for errors
- Verify the Firebase Hosting rewrite rule is correctly configured
- Ensure the service account has appropriate permissions
- Check that the data export script created valid JSON files in the `analytics/raw` directory