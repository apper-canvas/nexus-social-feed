import postData from '../mockData/posts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostService {
  constructor() {
    this.posts = [...postData];
  }

  async getAll() {
    await delay(400);
    return [...this.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await delay(250);
    const post = this.posts.find(p => p.id === id);
    if (!post) throw new Error('Post not found');
    return { ...post };
  }

  async getByUserId(userId) {
    await delay(300);
    const userPosts = this.posts.filter(p => p.userId === userId);
    return userPosts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(post => ({ ...post }));
  }

  async create(postData) {
    await delay(500);
    const newPost = {
      id: Date.now().toString(),
      userId: 'current-user-id',
      content: postData.content || '',
      imageUrl: postData.imageUrl || null,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    this.posts.unshift(newPost);
    return { ...newPost };
  }

  async update(id, updateData) {
    await delay(350);
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) throw new Error('Post not found');
    
    this.posts[postIndex] = { ...this.posts[postIndex], ...updateData };
    return { ...this.posts[postIndex] };
  }

  async delete(id) {
    await delay(300);
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) throw new Error('Post not found');
    
    this.posts.splice(postIndex, 1);
    return { success: true };
  }

  async toggleLike(postId, userId = 'current-user-id') {
    await delay(200);
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error('Post not found');
    
    const post = this.posts[postIndex];
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }
    
    return { ...post };
  }

  async getFeed(userId = 'current-user-id') {
    await delay(450);
    // Mock: return all posts as if following everyone
    return [...this.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export default new PostService();