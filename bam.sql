CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE bampartments(
	department_id INTEGER(20) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(12,3) NOT NULL,
    PRIMARY KEY(department_id)
);

INSERT INTO bampartments(department_name,over_head_costs)
VALUES ("Books",2000),
("Electronics",10000),
("Entertainment",3000),
("Kitchen",3000),
("Movies/Shows",1000),
("Pants",2000),
("Shirts",1000),
("Shoes",5000);

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
("Zero Cool the Novel","Books",19.99,4),
("McBlender 4-Speed","Kitchen",40.00,45),
("GameThing DS","Electronics",90.00,100),
("Pink Shoes","Shoes",25.25,14),
("Monsters & Quests Starter Set","Entertainment",50.45,150),
("Monsters & Quests Expansion Pack","Entertainment",29.99,150);

ALTER TABLE bamventory
ADD product_sales DECIMAL(6,2) NOT NULL;