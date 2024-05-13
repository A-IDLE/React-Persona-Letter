export function useAuth() {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  }