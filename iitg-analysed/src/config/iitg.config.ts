/**
 * @file src/config/iitg.config.ts
 * IIT Guwahati specific constants and configuration.
 * Add new departments, portals, and contacts here.
 */

export const IITG = {
  name: 'Indian Institute of Technology Guwahati',
  shortName: 'IIT Guwahati',
  abbreviation: 'IITG',
  location: {
    lat: 26.1918,
    lng: 91.6946,
    city: 'Guwahati',
    state: 'Assam',
    country: 'India',
  },
  urls: {
    main: 'https://www.iitg.ac.in',
    news: 'https://www.iitg.ac.in/news/',
    research: 'https://www.iitg.ac.in/research/',
    placements: 'https://www.iitg.ac.in/cdc/',
    events: 'https://www.iitg.ac.in/events/',
    techniche: 'https://techniche.org',
    alcheringa: 'https://alcheringa.in',
  },
} as const;

export const DEPARTMENTS = [
  { id: 'bsbe', name: 'Biosciences & Bioengineering', code: 'BSBE' },
  { id: 'chem', name: 'Chemical Engineering', code: 'ChE' },
  { id: 'chemistry', name: 'Chemistry', code: 'Chem' },
  { id: 'civil', name: 'Civil Engineering', code: 'CE' },
  { id: 'cse', name: 'Computer Science & Engineering', code: 'CSE' },
  { id: 'design', name: 'Design', code: 'Des' },
  { id: 'ece', name: 'Electronics & Electrical Engineering', code: 'EEE' },
  { id: 'hss', name: 'Humanities & Social Sciences', code: 'HSS' },
  { id: 'maths', name: 'Mathematics', code: 'Math' },
  { id: 'mech', name: 'Mechanical Engineering', code: 'ME' },
  { id: 'physics', name: 'Physics', code: 'Phy' },
] as const;

export type DepartmentId = typeof DEPARTMENTS[number]['id'];

export const CAMPUS_BOUNDS = {
  north: 26.205,
  south: 26.178,
  east: 91.715,
  west: 91.675,
} as const;
