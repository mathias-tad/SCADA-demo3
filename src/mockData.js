// 100% Exact match to original C# Eemacs.Models.UserViewModel & EditUserModel
export const ORIGINAL_ROLES = [
  "Administrator",
  "Operator",
  "Control",
  "Monitor",
  "Auditor",
  "None"
];

export const initialScadaUsers = [
  {
    userId: "f8d1c7e2-4a9b-4321-9876-1234567890ab",
    firstName: "Pete",
    lastName: "Higgens",
    organization: "Extreme Endeavors",
    phoneNumber: "304-555-1818",
    email: "phiggins@gmail.com",
    selectedRole: "Operator",
    lastActivity: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 mins ago (within 20 mins)
    nodeMessagesScreen: true,
    nodeMessagesText: true,
    nodeMessagesEmail: false,
    eemacsMessagesScreen: true,
    eemacsMessagesText: true,
    eemacsMessagesEmail: false,
    alarmMessagesScreen: true,
    alarmMessagesText: true,
    alarmMessagesEmail: true,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
  },
  {
    userId: "e7c0b6d1-3b8a-4210-8765-0123456789ba",
    firstName: "Mike",
    lastName: "Masterman",
    organization: "Extreme Endeavors",
    phoneNumber: "304-555-1818",
    email: "Mike.Masterman@extreme-endeavors.com",
    selectedRole: "Administrator",
    lastActivity: new Date(Date.now() - 11 * 60 * 1000).toISOString(), // 11 mins ago (within 20 mins)
    nodeMessagesScreen: true,
    nodeMessagesText: true,
    nodeMessagesEmail: true,
    eemacsMessagesScreen: true,
    eemacsMessagesText: true,
    eemacsMessagesEmail: true,
    alarmMessagesScreen: true,
    alarmMessagesText: true,
    alarmMessagesEmail: true,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
  },
  {
    userId: "d6b9a5c0-2a79-4109-7654-9012345678cd",
    firstName: "Cynthia",
    lastName: "Morales",
    organization: "Extreme Endeavors",
    phoneNumber: "304-555-9012",
    email: "cynthia.m@extreme-endeavors.com",
    selectedRole: "Control",
    lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago (within 20 mins)
    nodeMessagesScreen: true,
    nodeMessagesText: false,
    nodeMessagesEmail: true,
    eemacsMessagesScreen: true,
    eemacsMessagesText: false,
    eemacsMessagesEmail: true,
    alarmMessagesScreen: false,
    alarmMessagesText: false,
    alarmMessagesEmail: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  },
  {
    userId: "c5a894b9-1968-4098-6543-8901234567de",
    firstName: "Kristi",
    lastName: "Miller",
    organization: "Valley Utility District",
    phoneNumber: "304-555-8833",
    email: "kmiller@extreme-endeavors.com",
    selectedRole: "Operator",
    lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago (within 20 mins)
    nodeMessagesScreen: true,
    nodeMessagesText: true,
    nodeMessagesEmail: false,
    eemacsMessagesScreen: false,
    eemacsMessagesText: true,
    eemacsMessagesEmail: false,
    alarmMessagesScreen: true,
    alarmMessagesText: true,
    alarmMessagesEmail: false,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
  },
  {
    userId: "b49783a8-0857-4f87-5432-7890123456ef",
    firstName: "Chanan",
    lastName: "Patel",
    organization: "Extreme Endeavors",
    phoneNumber: "304-555-4491",
    email: "cpatel@extreme-endeavors.com",
    selectedRole: "Monitor",
    lastActivity: new Date(Date.now() - 48 * 60 * 1000).toISOString(), // 48 mins ago (> 20 mins)
    nodeMessagesScreen: true,
    nodeMessagesText: true,
    nodeMessagesEmail: true,
    eemacsMessagesScreen: true,
    eemacsMessagesText: false,
    eemacsMessagesEmail: true,
    alarmMessagesScreen: true,
    alarmMessagesText: false,
    alarmMessagesEmail: false,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  },
  {
    userId: "a3867297-9746-4e76-4321-6789012345fa",
    firstName: "Wendy",
    lastName: "Harris",
    organization: "State Environmental Board",
    phoneNumber: "304-555-6677",
    email: "wharris@extreme-endeavors.com",
    selectedRole: "Auditor",
    lastActivity: new Date(Date.now() - 95 * 60 * 1000).toISOString(), // 95 mins ago (> 20 mins)
    nodeMessagesScreen: false,
    nodeMessagesText: false,
    nodeMessagesEmail: true,
    eemacsMessagesScreen: false,
    eemacsMessagesText: false,
    eemacsMessagesEmail: true,
    alarmMessagesScreen: true,
    alarmMessagesText: false,
    alarmMessagesEmail: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
  }
];

// Helper to determine if active in the last 20 minutes (exact logic from Users.cshtml)
export function isActiveLast20Mins(lastActivityStr) {
  if (!lastActivityStr) return false;
  const diffSec = (Date.now() - new Date(lastActivityStr).getTime()) / 1000;
  return diffSec < 1200; // 20 minutes = 1200 seconds
}

// Helper to determine water vs tech category from selectedRole
export function isWaterRole(selectedRole) {
  return selectedRole === "Operator" || selectedRole === "Control";
}
