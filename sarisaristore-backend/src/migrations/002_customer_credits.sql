-- Apply once to the existing Sari-Sari Store database.
-- This migration is additive: it does not alter existing sales, product, or inventory tables.
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  nickname VARCHAR(100) NULL,
  contact_number VARCHAR(50) NULL,
  address TEXT NULL,
  notes TEXT NULL,
  profile_picture VARCHAR(500) NULL,
  credit_limit DECIMAL(12,2) NULL,
  is_archived TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_credits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  sale_id INT NOT NULL,
  original_amount DECIMAL(12,2) NOT NULL,
  balance DECIMAL(12,2) NOT NULL,
  due_date DATE NULL,
  status ENUM('unpaid','partial','paid') NOT NULL DEFAULT 'unpaid',
  last_payment_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_customer_credit_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT fk_customer_credit_sale FOREIGN KEY (sale_id) REFERENCES sales(id),
  UNIQUE KEY uq_customer_credit_sale (sale_id),
  INDEX idx_customer_credit_customer (customer_id),
  INDEX idx_customer_credit_due_date (due_date)
);

CREATE TABLE IF NOT EXISTS customer_credit_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  credit_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  notes VARCHAR(500) NULL,
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_credit_payment_credit FOREIGN KEY (credit_id) REFERENCES customer_credits(id),
  CONSTRAINT fk_credit_payment_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_credit_payment_credit (credit_id),
  INDEX idx_credit_payment_paid_at (paid_at)
);
