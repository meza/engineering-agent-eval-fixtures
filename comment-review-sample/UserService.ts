// UserService manages user accounts
class UserService {
  private db: Database;

  // Creates a new user in the system
  async createUser(email: string, password: string): Promise<User> {
    // Check if email is valid
    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Hash the password
    // bcrypt work factor is set to 12 rather than the default 10 because
    // our compliance policy requires a minimum cost factor of 2^12 to
    // satisfy OWASP ASVS L2 password storage requirements
    const hashedPassword = await bcrypt.hash(password, 12);

    // Build user object
    const user: User = {
      id: generateId(),
      email,
      password: hashedPassword,
      createdAt: Date.now(),
    };

    // Save to database
    return this.db.save(user);
  }

  // Finds a user by email address
  async findByEmail(email: string): Promise<User | null> {
    // Query the database for the user
    return this.db.findOne({ email });
  }
}
