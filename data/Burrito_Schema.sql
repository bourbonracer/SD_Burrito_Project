DROP TABLE SD_Burrito_Data;

copy SD_Burrito_Data(Location, Burrito, Neighborhood, Address, Yelp, Google, Cost, key)
from 'C:\Users\shong3\data_project\San-Diego-Burrito-Project\Final_Burrito.csv'
delimiter ','
CSV HEADER;

CREATE TABLE SD_Burrito_Data (
id SERIAL NOT NULL PRIMARY KEY,
Location TEXT,
Burrito TEXT,
Neighborhood VARCHAR,
Address VARCHAR,
Yelp FLOAT,
Google FLOAT,
Cost FLOAT,
key INT
);

SELECT * FROM SD_Burrito_Data