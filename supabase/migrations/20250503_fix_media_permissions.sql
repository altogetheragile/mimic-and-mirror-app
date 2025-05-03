
-- Create RLS policies for media_assets table to allow uploads
CREATE POLICY "Allow authenticated users to insert media assets" ON public.media_assets
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

-- Create RLS policies for media_assets table to allow users to select their own media and published media
CREATE POLICY "Allow users to select their own media" ON public.media_assets
FOR SELECT TO authenticated
USING (auth.uid() = uploaded_by OR is_deleted = false);

-- Create RLS policies for storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

-- Give users access to upload to storage
CREATE POLICY "Allow authenticated users to upload media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own storage objects
CREATE POLICY "Allow users to update their own media" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to view public media
CREATE POLICY "Allow public access to media" ON storage.objects
FOR SELECT
USING (bucket_id = 'media');
