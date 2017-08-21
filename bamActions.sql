USE bamazonDB;

SELECT * FROM bamventory;

SELECT * FROM bampartments;

SELECT DISTINCT department_name,COUNT(department_name) AS item_count
FROM bamventory GROUP BY department_name;

SELECT department_name FROM bampartments;

ALTER TABLE bamventory
ADD product_sales DECIMAL(6,2) NOT NULL;

SELECT department_name,sum(product_sales) FROM bamventory
GROUP BY department_name;

-- join below used to get profit info
SELECT bampartments.department_id,bampartments.department_name,bampartments.over_head_costs,
sum(bamventory.product_sales) AS total_sales,sum(bamventory.product_sales)-bampartments.over_head_costs AS profit
FROM bamventory INNER JOIN bampartments
ON bampartments.department_name=bamventory.department_name
GROUP BY department_name;

SELECT bampartments.department_id,bampartments.department_name,bampartments.over_head_costs,bamventory.product_sales,bamventory.product_sales-bampartments.over_head_costs AS Profit
FROM bampartments INNER JOIN bamventory
ON bampartments.department_name=bamventory.department_name;

DELETE FROM bamventory WHERE item_id = 24;
DELETE FROM bampartments WHERE department_id > 8;