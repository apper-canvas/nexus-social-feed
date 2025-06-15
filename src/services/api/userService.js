import userData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...userData];
    this.currentUser = this.users[0]; // Mock current user
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(250);
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user };
  }

  async getCurrentUser() {
    await delay(200);
    return { ...this.currentUser };
  }

  async searchUsers(query) {
    await delay(400);
    if (!query) return [];
    
    const filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.bio.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredUsers.map(user => ({ ...user }));
  }

  async followUser(userId) {
    await delay(300);
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    const user = this.users[userIndex];
    user.followersCount += 1;
    
    return { ...user };
  }

  async unfollowUser(userId) {
    await delay(300);
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    const user = this.users[userIndex];
    user.followersCount = Math.max(0, user.followersCount - 1);
    
    return { ...user };
  }

  async updateProfile(id, updateData) {
    await delay(400);
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    this.users[userIndex] = { ...this.users[userIndex], ...updateData };
    
    if (this.currentUser.id === id) {
      this.currentUser = { ...this.users[userIndex] };
    }
    
    return { ...this.users[userIndex] };
  }

  async getSuggestions() {
    await delay(350);
    const suggestions = this.users
      .filter(user => user.id !== this.currentUser.id)
      .slice(0, 5);
    
    return suggestions.map(user => ({ ...user }));
  }
}

export default new UserService();