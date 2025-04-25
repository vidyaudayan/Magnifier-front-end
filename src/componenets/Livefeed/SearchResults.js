export const SearchResultType = {
    POST: 'post',
    USER: 'user',
    NEWS: 'news',
    TOPIC: 'topic'
  };
  
  export const SearchResult = {
    id: '',
    type: '',
    title: '',
    description: '',
    image: '',
    metadata: {
      timestamp: '',
      likes: 0,
      followers: 0,
      posts: 0,
      trending: false
    }
  };