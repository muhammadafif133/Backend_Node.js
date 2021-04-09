CREATE TABLE listings (
      ID INT NOT NULL AUTO_INCREMENT,  
      dogName VARCHAR(32) NOT NULL,  
      details TEXT NOT NULL,
      dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
      dateModified DATETIME ON UPDATE CURRENT_TIMESTAMP,
      imageURL VARCHAR(2048),  
      published BOOL,
      employeeID INT,
      location VARCHAR(256),
      breeds VARCHAR(32),
      PRIMARY KEY (ID),
      FOREIGN KEY (employeeID) REFERENCES employee (ID)
);
