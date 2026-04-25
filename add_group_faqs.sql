-- MIGRATION: ADD RULES AND FAQ TO GROUPS
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS rules text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT '[]'::jsonb;

-- UPDATE SEED DATA WITH HIGH-FIDELITY FAQS
UPDATE public.groups 
SET rules = '1. Respect the Beach: No littering during sessions. 2. Turtle Awareness: Follow all seasonal nesting guidelines. 3. Intergenerational Play: Be patient with newer residents.',
    faq = '[{"q": "Where do we meet?", "a": "Usually at the Juno Beach Pier entrance near the benches."}, {"q": "Is equipment provided?", "a": "For community sessions, we have a few loaner boards, but please bring your own if possible."}]'::jsonb
WHERE name = 'Juno Beach Boardriders';

UPDATE public.groups 
SET rules = '1. All levels welcome. 2. Bring your own paddle if possible. 3. Tournament rules apply for Saturday sessions.',
    faq = '[{"q": "What happens if it rains?", "a": "We move the session to the Delray Indoor Center on Congress Ave."}, {"q": "Are there age limits?", "a": "Residents 13+ are welcome. Under 16 must have a guardian nearby."}]'::jsonb
WHERE name = 'Delray Pickleball Pros';
