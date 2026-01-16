
import { User, SavedStory } from "../types";

const STORAGE_KEY = 'tellatale_users';

const getUsers = (): Record<string, User> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const saveUsers = (users: Record<string, User>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const signup = (username: string, password: string): User | null => {
  const users = getUsers();
  if (users[username]) return null;
  const newUser: User = { username, password, history: [] };
  users[username] = newUser;
  saveUsers(users);
  return newUser;
};

export const login = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users[username];
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const saveStoryToHistory = (username: string, story: SavedStory): User | null => {
  const users = getUsers();
  const user = users[username];
  if (!user) return null;
  
  // Update or Add
  const existingIdx = user.history.findIndex(s => s.id === story.id);
  if (existingIdx >= 0) {
    user.history[existingIdx] = story;
  } else {
    user.history.unshift(story);
  }
  
  users[username] = user;
  saveUsers(users);
  return user;
};
