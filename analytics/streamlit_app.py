import pandas as pd
import plotly.express as px
import streamlit as st
from pathlib import Path
from datetime import datetime

st.set_page_config(page_title="Mood Analytics", layout="wide")

DATA_DIR = Path(__file__).parent / "raw"
user_files = sorted(DATA_DIR.glob("*.json"))
uid = st.sidebar.selectbox("User", [p.stem for p in user_files])

df = pd.read_json(DATA_DIR / f"{uid}.json")          # timestamp, mood, intensity
df["ts"] = pd.to_datetime(df["timestamp"])
df["date"] = df["ts"].dt.date
df["weekday"] = df["ts"].dt.dayofweek

daily = df.groupby("date").agg(avg_intensity=("intensity", "mean")).reset_index()

# —————————— Layout —————————— 
st.header("Mood Trends")

st.plotly_chart(
    px.line(daily, x="date", y="avg_intensity", 
            title="Average Mood Intensity per Day"), 
    use_container_width=True
)

weekend = df[df["weekday"] >= 5]["intensity"].mean()
weekday = df[df["weekday"] < 5]["intensity"].mean()
if pd.notna(weekend) and pd.notna(weekday):
    diff = (weekend - weekday) / weekday * 100
    st.info(f"📊 On weekends your mood intensity is **{diff:+.1f}%** versus weekdays.")

# Add song correlation analysis
if 'songId' in df.columns:
    st.header("Song & Mood Correlation")
    
    # Get song data
    song_mood = df.groupby('songId').agg(
        avg_mood_intensity=('intensity', 'mean'),
        listen_count=('songId', 'count')
    ).reset_index()
    
    # Display top songs by mood impact
    st.subheader("Songs with Highest Mood Impact")
    st.plotly_chart(
        px.bar(song_mood.sort_values('avg_mood_intensity', ascending=False).head(10),
              x='songId', y='avg_mood_intensity',
              title="Songs with Highest Mood Intensity"),
        use_container_width=True
    )

# Add genre analysis if available
if 'genre' in df.columns:
    st.header("Genre Analysis")
    genre_mood = df.groupby('genre').agg(
        avg_mood=('intensity', 'mean'),
        listen_count=('genre', 'count')
    ).reset_index()
    
    st.plotly_chart(
        px.scatter(genre_mood, x='listen_count', y='avg_mood', 
                 size='listen_count', color='genre',
                 title="Genre Impact on Mood"),
        use_container_width=True
    )