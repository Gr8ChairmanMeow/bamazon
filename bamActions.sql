USE bamazonDB;

SELECT * FROM bamventory;

SELECT DISTINCT department_name,COUNT(department_name) AS item_count
FROM bamventory GROUP BY department_name;

DELETE FROM bamventory WHERE item_id = 24;