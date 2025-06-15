import Home from '@/components/pages/Home';
import Search from '@/components/pages/Search';
import CreatePost from '@/components/pages/CreatePost';
import Chat from '@/components/pages/Chat';
import Profile from '@/components/pages/Profile';
import PostDetail from '@/components/pages/PostDetail';
import ChatThread from '@/components/pages/ChatThread';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home,
    showInNav: true
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search,
    showInNav: true
  },
  create: {
    id: 'create',
    label: 'Create',
    path: '/create',
    icon: 'Plus',
    component: CreatePost,
    showInNav: true,
    isFloating: true
  },
  chat: {
    id: 'chat',
    label: 'Chat',
    path: '/chat',
    icon: 'MessageCircle',
    component: Chat,
    showInNav: true
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile,
    showInNav: true
  },
  postDetail: {
    id: 'postDetail',
    label: 'Post',
    path: '/post/:id',
    component: PostDetail,
    showInNav: false
  },
  chatThread: {
    id: 'chatThread',
    label: 'Chat Thread',
    path: '/chat/:userId',
    component: ChatThread,
    showInNav: false
  }
};

export const routeArray = Object.values(routes);
export default routes;