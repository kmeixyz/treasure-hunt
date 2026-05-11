// Storage adapter for custom levels — backed by Supabase.
// Table: custom_levels (code PK, door_count, treasure_mode, treasure_door,
//                       feedback_type, has_limit, move_limit, created_at)

import { createClient } from '@supabase/supabase-js';

// Create the client lazily so missing env vars during SSG/build don't crash.
let _client = null;
function getClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return _client;
}

export async function saveLevel(code, config) {
  const { error } = await getClient().from('custom_levels').upsert({
    code:           code.toUpperCase(),
    door_count:     config.doorCount,
    treasure_mode:  config.treasureMode,
    treasure_door:  config.treasureDoor ?? null,
    feedback_type:  config.feedbackType,
    has_limit:      config.hasLimit,
    move_limit:     config.moveLimit ?? null,
    created_at:     new Date().toISOString(),
  });
  return { ok: !error, error: error?.message };
}

export async function loadLevel(code) {
  const { data, error } = await getClient()
    .from('custom_levels')
    .select('door_count, treasure_mode, treasure_door, feedback_type, has_limit, move_limit')
    .eq('code', code.toUpperCase().trim())
    .single();

  if (error || !data) return null;

  return {
    doorCount:    data.door_count,
    treasureMode: data.treasure_mode,
    treasureDoor: data.treasure_door,
    feedbackType: data.feedback_type,
    hasLimit:     data.has_limit,
    moveLimit:    data.move_limit,
  };
}
