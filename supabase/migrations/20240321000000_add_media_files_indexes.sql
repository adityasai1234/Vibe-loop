

-- Add index for owner_id to speed up user-specific queries
CREATE INDEX IF NOT EXISTS media_files_owner_id_idx 
ON public.media_files (owner_id);

-- Add index for file_name to support search
CREATE INDEX IF NOT EXISTS media_files_file_name_idx 
ON public.media_files (file_name);

CREATE OR REPLACE FUNCTION get_paginated_media_files(
  _page_size integer,
  _cursor_inserted_at timestamptz DEFAULT NULL,
  _cursor_id uuid DEFAULT NULL,
  _owner_id uuid DEFAULT NULzL
)
RETURNS TABLE (
  items json,
  next_cursor json
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _items json;
  _next_cursor json;
BEGIN
  -- Get the items
  WITH paginated_items AS (
    SELECT 
      m.*,
      -- Get the next cursor values
      LEAD(inserted_at) OVER (ORDER BY inserted_at, id) as next_inserted_at,
      LEAD(id) OVER (ORDER BY inserted_at, id) as next_id
    FROM media_files m
    WHERE 
      -- Apply cursor condition if provided
      (_cursor_inserted_at IS NULL OR 
       (inserted_at, id) > (_cursor_inserted_at, _cursor_id))
      -- Filter by owner if provided
      AND (_owner_id IS NULL OR owner_id = _owner_id)
    ORDER BY inserted_at, id
    LIMIT _page_size + 1  -- Get one extra to determine if there are more
  )
  SELECT 
    json_agg(
      CASE WHEN row_number() OVER (ORDER BY inserted_at, id) <= _page_size 
      THEN row_to_json(p) END
    ) FILTER (WHERE row_number() OVER (ORDER BY inserted_at, id) <= _page_size),
    json_build_object(
      'inserted_at', next_inserted_at,
      'id', next_id
    )
  INTO _items, _next_cursor
  FROM paginated_items p;

  -- Return both the items and the next cursor
  RETURN QUERY SELECT _items, _next_cursor;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_paginated_media_files TO authenticated;

-- Add RLS policy to ensure users can only access their own files
CREATE POLICY "Users can access their own media files"
  ON public.media_files
  FOR SELECT
  USING (auth.uid() = owner_id); 