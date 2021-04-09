CREATE TABLE favourites (
  listingID INT NOT NULL,
  userID INT NOT NULL,
  FOREIGN KEY (listingID) REFERENCES listings (ID) ON DELETE CASCADE,
  FOREIGN KEY (userID) REFERENCES users (ID) ON DELETE CASCADE,
  PRIMARY KEY (listingID, userID)
);
