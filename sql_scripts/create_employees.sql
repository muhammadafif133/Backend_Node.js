CREATE TABLE employees (
      ID INT NOT NULL AUTO_INCREMENT,
      role VARCHAR(16) NOT NULL DEFAULT 'employee',
      firstName VARCHAR(32),  
      lastName VARCHAR(32),
      empUsername VARCHAR(16) UNIQUE NOT NULL,
      dateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
      password VARCHAR(256),  
      passwordSalt VARCHAR(256),  
      email VARCHAR(64) UNIQUE NOT NULL,
      avatarURL VARCHAR(64),
      PRIMARY KEY (ID),
      FOREIGN KEY (role) REFERENCES roles (name)
);