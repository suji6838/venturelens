export type User = { name: string; email: string }
type StoredUser = User & { password: string }

const USERS_KEY = 'venturelens_users'

function loadUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// No backend yet (see project memory) — accounts live only in this browser's localStorage,
// and the "token" is just the email. Swap for real auth once a backend exists.
export async function register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
  const users = loadUsers()
  if (users[email]) throw new Error('이미 가입된 이메일입니다.')
  users[email] = { name, email, password }
  saveUsers(users)
  return { user: { name, email }, token: email }
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const users = loadUsers()
  const found = users[email]
  if (!found) throw new Error('가입되지 않은 이메일입니다.')
  if (found.password !== password) throw new Error('비밀번호가 일치하지 않습니다.')
  return { user: { name: found.name, email: found.email }, token: email }
}

export function getSession(token: string): User | null {
  const users = loadUsers()
  const found = users[token]
  return found ? { name: found.name, email: found.email } : null
}
