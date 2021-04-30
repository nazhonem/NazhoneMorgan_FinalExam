DROP TABLE IF EXISTS `meal_db`.`meal_reviews` ;
CREATE TABLE IF NOT EXISTS `meal_db`.`meal_reviews` (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    meal_name VARCHAR(255) NOT NULL,
    review TEXT NOT NULL,
    review_date DATE NOT NULL
);

INSERT INTO `meal_db`.`meal_reviews` (meal_name, review, review_date) VALUES
    ('Spicy Arrabiata Penne', 'good', NOW()),
    ('Teriyaki Chicken Casserole', 'bad', NOW()),
    ('Honey Teriyaki Salmon', 'okay', NOW());