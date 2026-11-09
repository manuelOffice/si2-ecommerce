CREATE OR REPLACE FUNCTION pick_items (carrito JSONB[], param_venta_id INT) RETURNS BOOLEAN AS $$
DECLARE
    request JSONB;
	req_product_id INT;
    req_cantidad INT;
	current_cantidad INT;
BEGIN
    -- Loop through each producto and its required cantidad in the carrito
    FOR request IN ARRAY carrito
    LOOP
		req_product_id := (tuple->>'producto_id')::INT;
		req_cantidad := (tuple->>'cantidad')::INT;
        -- Lock and update the exact required cantidad for each producto concurrently
        WITH selected AS (
            SELECT sku
            FROM item
            WHERE producto_id = req_product_id
            AND venta_id IS NULL
            LIMIT req_cantidad
            FOR UPDATE SKIP LOCKED
        )
		UPDATE item AS i
            SET venta_id = param_venta_id
			FROM selected AS s
            WHERE i.sku = s.sku

        GET DIAGNOSTICS current_cantidad = ROW_COUNT;

        -- If any producto lacks sufficient stock, raise an exception to trigger an automatic rollback
        IF current_cantidad < req_cantidad THEN
            RAISE EXCEPTION
				'Insufficient stock available for producto_id %: requested %, available %',
				req_product_id,
				req_cantidad,
				current_cantidad;
        END IF;
    END LOOP;

    RETURN TRUE;
END;
$$ LANGUAGE PLPGSQL;