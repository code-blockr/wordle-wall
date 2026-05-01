# Changelog / Patch Notes

## May 1 2026

- Dimmer placeholder text in the paste modal

    - The example share card in the paste modal text box is now visibly dimmer, making it clearer that it's placeholder text and not some bug or artifact. 

- "Paste Wordle Share Card" button now disables after score submission

    - Like the score buttons, the paste button is now greyed out and unclickable once you've already submitted a score for the selected day.

- Mobile layout improvements

    - Date in the sub-header now shows in a pseudo-ISO 8601 format on mobile (e.g. "Wed 2026-05-01") instead of the full long-form.
    - Score buttons 1-6 and FAIL are now spread evenly across a single row on mobile. The "Paste Wordle Share Card" button sits on its own row underneath.
    - Removed the "Today" badge from the weekly chart on mobile — the column highlight is enough and makes spacing nicer.
    - The weekly score table now scrolls horizontally on mobile so no columns get cut off, if it STILL doesn't fit on some people's phones. 

- Added a winner banner 
    - Mondays and Tuesdays will display the winner of the previous week. 

- Reversed the order of the y-axis on the stat charts
    - makes it clearer who's actually "winning" since up usually means good on charts. 
    
## April 29 2026

- Wordle link for new submissions

    - If you haven't logged your score yet for the day, there's now a direct link to the NYT Wordle right below the score buttons. Saves you from having to go find it yourself.

- Retroactive score entry

    - You can now click on any day in the current week's grid (Monday through today) to enter or update your score for that day. The score card title updates to reflect whichever day you've got selected, so it's clear what you're submitting for. Handy if you forgot to log Tuesday's score.

- Layout overhaul

    - Moved things around to better reflect what actually matters. The leaderboard is now always visible right below the weekly grid. The old "View Stats" slide-up drawer is gone (I loved that drawer) — replaced with a "View Stats" accordion that lives inline on the page, with the charts up top and past week grids tucked inside a collapsible section below them. The bottom bar is also gone, replaced with a proper footer.

- Paste Wordle Share Card

    - New button in the score buttons row. Opens a modal where you can paste in the share text straight from the NYT app — it detects your score automatically, validates that the Wordle number actually matches the selected date, and submits with one more click. Escape to close, Enter to submit once a valid result is detected.

## April 28 2026

- Player colours now match between both stat charts

    - It was just easier to have all the players use one colour for the bar chart, but now they use the same variable to determine the colour associated with the user between both charts. 

- Updated score colour coding

    - Now there's a general progression from green to red for the number of tries it took to get the right wordle guess.


## April 27 2026

- User can select 6 guesses as their max before failure

    - I forgot you get 6 guesses, I thought 5 was all we got.

- Added a password to access the scoreboard

    - Now the welcome screen is password protected - to register on the board, you'll need the password. 

- Removed Ontario logos 

    - I thought it was funny to make the site look like a typical Ontario site that we would all be familiar with working on, but I have learned that crime is never a joke.