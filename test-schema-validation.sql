-- Test script to validate blog schema
-- Run this in Supabase SQL editor to verify schema

-- Test 1: Verify schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'blog';

-- Test 2: Verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'blog' 
ORDER BY table_name;

-- Test 3: Verify post_status enum
SELECT unnest(enum_range(NULL::blog.post_status)) AS status_values;

-- Test 4: Check table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'blog' 
ORDER BY table_name, ordinal_position;

-- Test 5: Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'blog';

-- Test 6: Check policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'blog'
ORDER BY tablename, policyname;

-- Test 7: Verify functions exist
SELECT 
    routine_name,
    routine_type,
    routine_schema
FROM information_schema.routines 
WHERE routine_schema = 'blog'
ORDER BY routine_name;

-- Test 8: Check triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'blog'
ORDER BY event_object_table, trigger_name;

-- Test 9: Verify indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'blog'
ORDER BY tablename, indexname;