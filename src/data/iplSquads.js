/**
 * iplSquads.js
 *
 * Keys = IPL team names (all 10 teams).
 * Each team has 11 player objects.
 *
 * Player shape:
 *   { name: string, role: 'BAT'|'BWL'|'AR'|'WK', nationality: string, battingStyle: 'RHB'|'LHB' }
 *
 * Mumbai Indians is fully populated with the 2025 season squad.
 * All other teams have placeholder entries — replace with real data.
 */

const iplSquads = {

  /* ─── Mumbai Indians ─────────────────────────────────────────────── */
  'Mumbai Indians': [
    { name: 'Rohit Sharma', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Ryan Rickelton', role: 'WK', nationality: 'South African', battingStyle: 'LHB' },
    { name: 'Suryakumar Yadav', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Tilak Varma', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Hardik Pandya', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Naman Dhir', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Robin Minz', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Deepak Chahar', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Jasprit Bumrah', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Will Jacks', role: 'AR', nationality: 'English', battingStyle: 'RHB' },
    { name: 'Shardul Thakur', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  /* ─── Chennai Super Kings ────────────────────────────────────────── */
  'Chennai Super Kings': [
    { name: 'CSK Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'CSK Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'CSK Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'CSK Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'CSK Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'CSK Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'CSK Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'CSK Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'CSK Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'CSK Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'CSK Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  /* ─── Royal Challengers Bengaluru ───────────────────────────────── */
  'Royal Challengers Bengaluru': [
    { name: 'RCB Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RCB Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'RCB Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RCB Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'RCB Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RCB Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RCB Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'RCB Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RCB Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RCB Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RCB Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  /* ─── Kolkata Knight Riders ──────────────────────────────────────── */
  'Kolkata Knight Riders': [
    { name: 'KKR Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'KKR Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'KKR Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'KKR Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'KKR Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'KKR Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'KKR Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'KKR Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'KKR Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'KKR Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'KKR Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  /* ─── Rajasthan Royals ───────────────────────────────────────────── */
  'Rajasthan Royals': [
    { name: 'RR Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RR Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'RR Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RR Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RR Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'RR Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RR Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'RR Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RR Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RR Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'RR Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  /* ─── Punjab Kings ───────────────────────────────────────────────── */
  'Punjab Kings': [
    { name: 'PBKS Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'PBKS Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'PBKS Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'PBKS Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'PBKS Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'PBKS Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'PBKS Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'PBKS Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'PBKS Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'PBKS Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'PBKS Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  /* ─── Delhi Capitals ─────────────────────────────────────────────── */
  'Delhi Capitals': [
    { name: 'DC Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'DC Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'DC Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'DC Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'DC Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'DC Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'DC Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'DC Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'DC Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'DC Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'DC Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'LHB' },
  ],

  /* ─── Sunrisers Hyderabad ────────────────────────────────────────── */
  'Sunrisers Hyderabad': [
    { name: 'SRH Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'SRH Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'SRH Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'SRH Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'SRH Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'SRH Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'SRH Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'SRH Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'SRH Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'SRH Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'SRH Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  /* ─── Gujarat Titans ─────────────────────────────────────────────── */
  'Gujarat Titans': [
    { name: 'GT Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'GT Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'GT Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'GT Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'GT Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'GT Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'GT Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'GT Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'GT Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'GT Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'GT Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  /* ─── Lucknow Super Giants ───────────────────────────────────────── */
  'Lucknow Super Giants': [
    { name: 'LSG Player 1', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'LSG Player 2', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'LSG Player 3', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'LSG Player 4', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'LSG Player 5', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'LSG Player 6', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'LSG Player 7', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'LSG Player 8', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'LSG Player 9', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'LSG Player 10', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'LSG Player 11', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

}

export default iplSquads
