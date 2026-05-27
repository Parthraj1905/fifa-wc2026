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
  'Mumbai Indians': [
    { name: 'Rohit Sharma', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Ryan Rickelton', role: 'WK', nationality: 'South African', battingStyle: 'LHB' },
    { name: 'Suryakumar Yadav', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Tilak Varma', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Hardik Pandya', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Naman Dhir', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Will Jacks', role: 'AR', nationality: 'English', battingStyle: 'RHB' },
    { name: 'Deepak Chahar', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Trent Boult', role: 'BWL', nationality: 'New Zealander', battingStyle: 'RHB' },
    { name: 'Jasprit Bumrah', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Shardul Thakur', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  'Chennai Super Kings': [
    { name: 'Ruturaj Gaikwad', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Ayush Mhatre', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Sanju Samson', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Dewald Brevis', role: 'BAT', nationality: 'South African', battingStyle: 'RHB' },
    { name: 'Shivam Dube', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'MS Dhoni', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Prashant Solanki', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Noor Ahmad', role: 'BWL', nationality: 'Afghan', battingStyle: 'RHB' },
    { name: 'Nathan Ellis', role: 'BWL', nationality: 'Australian', battingStyle: 'RHB' },
    { name: 'Khaleel Ahmed', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Matheesha Pathirana', role: 'BWL', nationality: 'Sri Lankan', battingStyle: 'RHB' },
  ],

  'Royal Challengers Bengaluru': [
    { name: 'Virat Kohli', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Phil Salt', role: 'WK', nationality: 'English', battingStyle: 'RHB' },
    { name: 'Devdutt Padikkal', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Rajat Patidar', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Jitesh Sharma', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Tim David', role: 'AR', nationality: 'Australian', battingStyle: 'RHB' },
    { name: 'Romario Shepherd', role: 'AR', nationality: 'West Indian', battingStyle: 'RHB' },
    { name: 'Krunal Pandya', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Bhuvneshwar Kumar', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Josh Hazlewood', role: 'BWL', nationality: 'Australian', battingStyle: 'RHB' },
    { name: 'Yash Dayal', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  'Kolkata Knight Riders': [
    { name: 'Finn Allen', role: 'WK', nationality: 'New Zealander', battingStyle: 'RHB' },
    { name: 'Sunil Narine', role: 'AR', nationality: 'West Indian', battingStyle: 'LHB' },
    { name: 'Ajinkya Rahane', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Angkrish Raghuvanshi', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Cameron Green', role: 'AR', nationality: 'Australian', battingStyle: 'RHB' },
    { name: 'Rinku Singh', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Ramandeep Singh', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Varun Chakravarthy', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Harshit Rana', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Vaibhav Arora', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Matheesha Pathirana', role: 'BWL', nationality: 'Sri Lankan', battingStyle: 'RHB' },
  ],

  'Sunrisers Hyderabad': [
    { name: 'Travis Head', role: 'BAT', nationality: 'Australian', battingStyle: 'LHB' },
    { name: 'Abhishek Sharma', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Ishan Kishan', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Nitish Kumar Reddy', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Heinrich Klaasen', role: 'WK', nationality: 'South African', battingStyle: 'RHB' },
    { name: 'Liam Livingstone', role: 'AR', nationality: 'English', battingStyle: 'RHB' },
    { name: 'Aniket Verma', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Pat Cummins', role: 'AR', nationality: 'Australian', battingStyle: 'RHB' },
    { name: 'Harshal Patel', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Jaydev Unadkat', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Zeeshan Ansari', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  'Rajasthan Royals': [
    { name: 'Yashasvi Jaiswal', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Vaibhav Suryavanshi', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Riyan Parag', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Dhruv Jurel', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Shimron Hetmyer', role: 'BAT', nationality: 'West Indian', battingStyle: 'LHB' },
    { name: 'Sam Curran', role: 'AR', nationality: 'English', battingStyle: 'LHB' },
    { name: 'Ravindra Jadeja', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Jofra Archer', role: 'BWL', nationality: 'English', battingStyle: 'RHB' },
    { name: 'Ravi Bishnoi', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Sandeep Sharma', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Tushar Deshpande', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  'Punjab Kings': [
    { name: 'Priyansh Arya', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Prabhsimran Singh', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Shreyas Iyer', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Nehal Wadhera', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Marcus Stoinis', role: 'AR', nationality: 'Australian', battingStyle: 'RHB' },
    { name: 'Shashank Singh', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Marco Jansen', role: 'AR', nationality: 'South African', battingStyle: 'LHB' },
    { name: 'Harpreet Brar', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Arshdeep Singh', role: 'BWL', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Yuzvendra Chahal', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Lockie Ferguson', role: 'BWL', nationality: 'New Zealander', battingStyle: 'RHB' },
  ],

  'Delhi Capitals': [
    { name: 'KL Rahul', role: 'WK', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Ben Duckett', role: 'BAT', nationality: 'English', battingStyle: 'LHB' },
    { name: 'Nitish Rana', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Axar Patel', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'David Miller', role: 'BAT', nationality: 'South African', battingStyle: 'LHB' },
    { name: 'Tristan Stubbs', role: 'WK', nationality: 'South African', battingStyle: 'RHB' },
    { name: 'Ashutosh Sharma', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Vipraj Nigam', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Mitchell Starc', role: 'BWL', nationality: 'Australian', battingStyle: 'LHB' },
    { name: 'Kuldeep Yadav', role: 'BWL', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'T Natarajan', role: 'BWL', nationality: 'Indian', battingStyle: 'LHB' },
  ],

  'Gujarat Titans': [
    { name: 'Shubman Gill', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Sai Sudharsan', role: 'BAT', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Jos Buttler', role: 'WK', nationality: 'English', battingStyle: 'RHB' },
    { name: 'Glenn Phillips', role: 'AR', nationality: 'New Zealander', battingStyle: 'RHB' },
    { name: 'Washington Sundar', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Shahrukh Khan', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Rahul Tewatia', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Rashid Khan', role: 'BWL', nationality: 'Afghan', battingStyle: 'RHB' },
    { name: 'Kagiso Rabada', role: 'BWL', nationality: 'South African', battingStyle: 'LHB' },
    { name: 'Mohammed Siraj', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Prasidh Krishna', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],

  'Lucknow Super Giants': [
    { name: 'Mitchell Marsh', role: 'AR', nationality: 'Australian', battingStyle: 'RHB' },
    { name: 'Aiden Markram', role: 'BAT', nationality: 'South African', battingStyle: 'RHB' },
    { name: 'Nicholas Pooran', role: 'WK', nationality: 'West Indian', battingStyle: 'LHB' },
    { name: 'Rishabh Pant', role: 'WK', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Ayush Badoni', role: 'BAT', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Abdul Samad', role: 'AR', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Wanindu Hasaranga', role: 'AR', nationality: 'Sri Lankan', battingStyle: 'RHB' },
    { name: 'Shahbaz Ahmed', role: 'AR', nationality: 'Indian', battingStyle: 'LHB' },
    { name: 'Mohammed Shami', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Mayank Yadav', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
    { name: 'Digvesh Rathi', role: 'BWL', nationality: 'Indian', battingStyle: 'RHB' },
  ],
}
export default iplSquads
