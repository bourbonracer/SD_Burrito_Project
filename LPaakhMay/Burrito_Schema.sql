DROP TABLE SD_Burrito_Data;

copy SD_Burrito_Data(Location, Burrito, Neighborhood, Address, Yelp, Google, Cost, key)
<<<<<<< HEAD
from '/tmp/Final_Burrito.csv'
=======
from 'C:\Users\shong3\data_project\San-Diego-Burrito-Project\Final_Burrito.csv'
>>>>>>> b9936336f60830e83b4ea454b7126e91a4c3a5fc
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