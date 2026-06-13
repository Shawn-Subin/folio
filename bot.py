# Pulse - Daily Summary Bot
# Fetches: weather (wttr.in) + a quote (zenquotes.io)
# Runs: every day at 8 AM IST via GitHub Actions

import requests
from datetime import datetime


def get_weather(city="Thiruvananthapuram"):
    """Fetch today's weather as a one-line text summary."""
    url = f"https://wttr.in/{city}?format=3"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text.strip()
    except Exception as e:
        return f"weather unavailable ({e})"


def get_quote():
    """Fetch a random motivational quote from ZenQuotes."""
    url = "https://zenquotes.io/api/random"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        quote = data[0]["q"]
        author = data[0]["a"]
        return f"{quote} — {author}"
    except Exception as e:
        return f"Quote unavailable ({e})"


def build_summary():
    """Assemble the full daily summary from all data sources."""
    today = datetime.today().strftime("%A, %d %B %Y")
    weather = get_weather()
    quote = get_quote()

    summary = f"""
========================
PULSE - Daily Summary
{today}
========================

Weather: {weather}

Quote of the day:
{quote}
"""
    return summary


def run():
    """Main entry point. Called by GitHub Actions."""
    summary = build_summary()
    print(summary)
    
    with open("daily_summary.txt", "w", encoding="utf-8") as f:
        f.write(summary)
    print("Pulse ran successfully.")


if __name__ == "__main__":
    run()