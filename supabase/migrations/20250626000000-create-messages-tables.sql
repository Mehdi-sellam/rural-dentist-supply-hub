-- Create messages table for client support tickets
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nom text NOT NULL,
  email text NOT NULL,
  phone text,
  sujet text NOT NULL,
  message text NOT NULL,
  cabinet_name text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create message_responses table for admin and client responses
CREATE TABLE IF NOT EXISTS public.message_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  responder_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  response text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for messages table
CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own messages" 
  ON public.messages 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all messages" 
  ON public.messages 
  FOR SELECT 
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all messages" 
  ON public.messages 
  FOR UPDATE 
  USING (public.is_current_user_admin());

-- RLS policies for message_responses table
CREATE POLICY "Users can view responses to their messages" 
  ON public.message_responses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.messages 
      WHERE id = message_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create responses to their messages" 
  ON public.message_responses 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages 
      WHERE id = message_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all responses" 
  ON public.message_responses 
  FOR SELECT 
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can create responses to any message" 
  ON public.message_responses 
  FOR INSERT 
  WITH CHECK (public.is_current_user_admin());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_message_responses_message_id ON public.message_responses(message_id);
CREATE INDEX IF NOT EXISTS idx_message_responses_responder_id ON public.message_responses(responder_id);

-- Create trigger for updated_at on messages table
CREATE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON public.messages 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column(); 