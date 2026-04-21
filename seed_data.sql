INSERT INTO posts (title, content, status, flagged_reasons)
VALUES
(
  'Welcome Note',
  'Welcome to the moderation platform. This post is intentionally polite, descriptive, and long enough to pass moderation checks.',
  'approved',
  NULL
),
(
  'Needs Work',
  'THIS IS BAD!!!',
  'flagged',
  '["Content is too short. Minimum length is 50 characters.", "Tone appears aggressive because the content is written in ALL CAPS.", "Tone appears overly aggressive due to excessive punctuation."]'
),
(
  'Live Announcement',
  'This published post is visible in read-only mode for end users and cannot be edited after publication.',
  'published',
  NULL
);
