CREATE TABLE employee (
      ID INT NOT NULL AUTO_INCREMENT,  
      firstName VARCHAR(32),  
      lastName VARCHAR(32),
      empUsername VARCHAR(16) UNIQUE NOT NULL,
      dateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
      password VARCHAR(256),  
      passwordSalt VARCHAR(256),  
      email VARCHAR(64) UNIQUE NOT NULL,
      avatarURL VARCHAR(64),
      PRIMARY KEY (ID)
);