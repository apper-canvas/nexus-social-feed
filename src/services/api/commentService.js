import commentData from '../mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommentService {
  constructor() {
    this.comments = [...commentData];
  }

  async getByPostId(postId) {
    await delay(300);
    const postComments = this.comments.filter(c => c.postId === postId);
    return postComments
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(comment => ({ ...comment }));
  }

  async create(commentData) {
    await delay(350);
    const newComment = {
      id: Date.now().toString(),
      postId: commentData.postId,
      userId: 'current-user-id',
      content: commentData.content,
      createdAt: new Date().toISOString()
    };
    
    this.comments.push(newComment);
    return { ...newComment };
  }

  async update(id, updateData) {
    await delay(300);
    const commentIndex = this.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) throw new Error('Comment not found');
    
    this.comments[commentIndex] = { ...this.comments[commentIndex], ...updateData };
    return { ...this.comments[commentIndex] };
  }

  async delete(id) {
    await delay(250);
    const commentIndex = this.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) throw new Error('Comment not found');
    
    this.comments.splice(commentIndex, 1);
    return { success: true };
  }

  async getById(id) {
    await delay(200);
    const comment = this.comments.find(c => c.id === id);
    if (!comment) throw new Error('Comment not found');
    return { ...comment };
  }

  async getAll() {
    await delay(350);
    return [...this.comments];
  }
}

export default new CommentService();