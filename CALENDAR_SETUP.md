# Calendar Integration Setup

## Setting up Cal.com

The site now uses Cal.com for calendar booking integration. Follow these steps to connect your calendar:

### Option 1: Using Cal.com (Recommended)

1. **Sign up for Cal.com**
   - Go to https://cal.com and create a free account
   - Or self-host Cal.com if you prefer

2. **Create an Event Type**
   - In your Cal.com dashboard, create a new event type called "Dinner Onboarding" or similar
   - Set the duration (e.g., 2 hours for dinner)
   - Configure your availability
   - Add your location (restaurant address, video call, etc.)

3. **Get your booking link**
   - Cal.com will give you a link like: `cal.com/your-username/dinner-onboarding`
   - Copy just the part after `cal.com/` (e.g., `your-username/dinner-onboarding`)

4. **Update the site**
   - Open `src/pages/index.tsx`
   - Find line 68: `data-cal-link="your-cal-username/dinner-onboarding"`
   - Replace `your-cal-username/dinner-onboarding` with your actual Cal.com event link

### Option 2: Using Calendly

If you prefer Calendly instead:

1. **Sign up for Calendly**
   - Go to https://calendly.com

2. **Create an Event Type**
   - Create a new event type for dinner bookings

3. **Update the code**
   - Replace the Cal.com script with Calendly's embed script
   - Or simply use a direct link to your Calendly page

### Example Configuration

In `src/pages/index.tsx`, line 68:

```tsx
// Replace this:
data-cal-link="your-cal-username/dinner-onboarding"

// With your actual Cal.com link:
data-cal-link="ivoine/dinner-with-founder"
```

### Testing

1. Run the dev server: `npm run dev` or `bun dev`
2. Click the "Schedule Your Dinner" button
3. A Cal.com modal should appear with your calendar

## Connecting to Your Personal Calendar

Cal.com can sync with:
- Google Calendar
- Outlook Calendar
- Apple Calendar
- iCloud Calendar

Configure this in your Cal.com dashboard under "Calendar Settings".

## Need Help?

- Cal.com docs: https://cal.com/docs
- Calendly docs: https://help.calendly.com/
