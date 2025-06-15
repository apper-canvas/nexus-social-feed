import messageData from '../mockData/messages.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MessageService {
  constructor() {
    this.messages = [...messageData];
    this.currentUserId = 'current-user-id';
  }

  async getConversations(userId = this.currentUserId) {
    await delay(400);
    const conversations = new Map();
    
    this.messages.forEach(message => {
      let conversationPartnerId;
      
      if (message.senderId === userId) {
        conversationPartnerId = message.receiverId;
      } else if (message.receiverId === userId) {
        conversationPartnerId = message.senderId;
      } else {
        return; // Message doesn't involve this user
      }
      
      if (!conversations.has(conversationPartnerId)) {
        conversations.set(conversationPartnerId, {
          partnerId: conversationPartnerId,
          lastMessage: message,
          unreadCount: 0
        });
      } else {
        const existing = conversations.get(conversationPartnerId);
        if (new Date(message.timestamp) > new Date(existing.lastMessage.timestamp)) {
          existing.lastMessage = message;
        }
      }
      
      // Count unread messages
      if (message.receiverId === userId && !message.read) {
        conversations.get(conversationPartnerId).unreadCount++;
      }
    });
    
    return Array.from(conversations.values()).map(conv => ({ ...conv }));
  }

  async getMessages(userId1, userId2) {
    await delay(350);
    const conversation = this.messages.filter(message => 
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
    );
    
    return conversation
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(message => ({ ...message }));
  }

  async sendMessage(senderId, receiverId, content) {
    await delay(300);
    const newMessage = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    this.messages.push(newMessage);
    return { ...newMessage };
  }

  async markAsRead(messageId) {
    await delay(200);
    const messageIndex = this.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) throw new Error('Message not found');
    
    this.messages[messageIndex].read = true;
    return { ...this.messages[messageIndex] };
  }

  async markConversationAsRead(userId, partnerId) {
    await delay(250);
    this.messages.forEach(message => {
      if (message.senderId === partnerId && message.receiverId === userId) {
        message.read = true;
      }
    });
    
    return { success: true };
  }

  async getById(id) {
    await delay(200);
    const message = this.messages.find(m => m.id === id);
    if (!message) throw new Error('Message not found');
    return { ...message };
  }

  async getAll() {
    await delay(400);
    return [...this.messages];
  }

  async create(messageData) {
    return this.sendMessage(messageData.senderId, messageData.receiverId, messageData.content);
  }

  async update(id, updateData) {
    await delay(300);
    const messageIndex = this.messages.findIndex(m => m.id === id);
    if (messageIndex === -1) throw new Error('Message not found');
    
    this.messages[messageIndex] = { ...this.messages[messageIndex], ...updateData };
    return { ...this.messages[messageIndex] };
  }

  async delete(id) {
    await delay(250);
    const messageIndex = this.messages.findIndex(m => m.id === id);
    if (messageIndex === -1) throw new Error('Message not found');
    
    this.messages.splice(messageIndex, 1);
    return { success: true };
  }
}

export default new MessageService();