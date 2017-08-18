CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE bamventory(
	item_id INTEGER(20) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    qty INTEGER(20) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO bamventory(product_name,department_name,price,qty)
VALUES ("Red Sneakers","Shoes",25.00,100),
("Ultimate Man Manga Series","Books",55.55,9),
("Vampire Girl with Weapons Anime Movie","Movies/Shows",12.99,11),
("Blue Sneakers","Shoes",25.00,120),
("Blue Jeans","Pants",35.00,80),
("Absolute Zero Fridge","Kitchen",250.00,15),
("Giant Robots Anime Series","Movies/Shows",35.00,8),
("Calculator","Electronics",15.50,35),
("Black Flag Shirt","Shirts",20.00,30),
("Nyan Cat Shirt","Shirts",15.00,30),
("Black Jeans","Pants",35.00,80),
("BK/WH Sneakers","Shoes",45.00,100),
("Super Kombat Game Card","Electronics",18.00,45),
("Wizard Boy & the Crazy Adventure","Books",10.99,25),
("Smash'Em Bros Game Card","Electronics",16.00,45),
("Gray Jeans","Pants",35.00,60),
("McBlender 4-Speed","Kitchen",40.00,45),
("GameThing DS","Electronics",90.00,100);

SELECT * FROM bamventory;