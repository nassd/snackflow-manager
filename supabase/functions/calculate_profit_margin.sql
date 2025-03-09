
CREATE OR REPLACE FUNCTION calculate_profit_margin(p_order_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_cost NUMERIC := 0;
  total_sale NUMERIC := 0;
  margin NUMERIC := 0;
BEGIN
  -- Calculate total cost price for all items in the order
  SELECT COALESCE(SUM(oi.quantity * p.cost_price), 0)
  INTO total_cost
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  WHERE oi.order_id = p_order_id;
  
  -- Get total sales price
  SELECT COALESCE(total_amount, 0)
  INTO total_sale
  FROM orders
  WHERE id = p_order_id;
  
  -- Calculate margin
  margin := total_sale - total_cost;
  
  RETURN margin;
END;
$$ LANGUAGE plpgsql;
